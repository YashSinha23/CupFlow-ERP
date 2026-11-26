package com.cupflow.CupFlow_ERP.shift;

import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.employee.Employee;
import com.cupflow.CupFlow_ERP.employee.EmployeeRepository;
import com.cupflow.CupFlow_ERP.employee.EmploymentStatus;
import com.cupflow.CupFlow_ERP.user.User;
import com.cupflow.CupFlow_ERP.user.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ShiftService {

    private static final int MAX_ROSTER_DAYS = 31;

    private final ShiftRepository shiftRepository;
    private final ShiftAssignmentRepository assignmentRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public ShiftService(ShiftRepository shiftRepository,
                        ShiftAssignmentRepository assignmentRepository,
                        EmployeeRepository employeeRepository,
                        UserRepository userRepository) {
        this.shiftRepository = shiftRepository;
        this.assignmentRepository = assignmentRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ShiftResponse> getShifts() {
        return shiftRepository.findAllByOrderByCodeAsc()
                .stream()
                .map(ShiftResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ShiftEmployeeResponse> getActiveEmployees() {
        return employeeRepository.findAllByStatusOrderByEmployeeNumberAsc(EmploymentStatus.ACTIVE)
                .stream()
                .map(ShiftEmployeeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ShiftAssignmentResponse> getAssignments(LocalDate from, LocalDate to) {
        validateDateRange(from, to);
        return assignmentRepository
                .findAllByWorkDateBetweenOrderByWorkDateAscEmployee_EmployeeNumberAsc(from, to)
                .stream()
                .map(ShiftAssignmentResponse::from)
                .toList();
    }

    @Transactional
    public List<ShiftAssignmentResponse> saveAssignments(
            List<ShiftAssignmentRequest> requests,
            UUID actorId) {

        if (requests == null || requests.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "At least one schedule change is required");
        }
        if (requests.size() > 1000) {
            throw new AppException(HttpStatus.BAD_REQUEST, "A batch can contain at most 1000 schedule changes");
        }

        for (ShiftAssignmentRequest request : requests) {
            validateRequest(request);
        }

        LocalDate from = requests.stream().map(ShiftAssignmentRequest::getWorkDate)
                .min(LocalDate::compareTo).orElseThrow();
        LocalDate to = requests.stream().map(ShiftAssignmentRequest::getWorkDate)
                .max(LocalDate::compareTo).orElseThrow();
        validateDateRange(from, to);

        Set<AssignmentKey> requestKeys = new HashSet<>();
        for (ShiftAssignmentRequest request : requests) {
            validateRequest(request);
            AssignmentKey key = new AssignmentKey(request.getEmployeeId(), request.getWorkDate());
            if (!requestKeys.add(key)) {
                throw new AppException(HttpStatus.BAD_REQUEST,
                        "A batch cannot contain the same employee and work date more than once");
            }
        }

        List<UUID> employeeIds = requests.stream()
                .map(ShiftAssignmentRequest::getEmployeeId)
                .distinct()
                .toList();
        Map<UUID, Employee> employees = employeeRepository.findAllById(employeeIds)
                .stream()
                .collect(Collectors.toMap(Employee::getId, employee -> employee));
        for (UUID employeeId : employeeIds) {
            Employee employee = employees.get(employeeId);
            if (employee == null) {
                throw new ResourceNotFoundException("Employee", employeeId.toString());
            }
            if (employee.getStatus() != EmploymentStatus.ACTIVE) {
                throw new AppException(HttpStatus.CONFLICT,
                        "Shift assignments can only be made for active employees");
            }
        }

        List<UUID> shiftIds = requests.stream()
                .filter(request -> request.getAssignmentStatus() == ShiftAssignmentStatus.SHIFT)
                .map(ShiftAssignmentRequest::getShiftId)
                .distinct()
                .toList();
        Map<UUID, Shift> shifts = shiftRepository.findAllById(shiftIds)
                .stream()
                .collect(Collectors.toMap(Shift::getId, shift -> shift));
        for (UUID shiftId : shiftIds) {
            if (!shifts.containsKey(shiftId)) {
                throw new ResourceNotFoundException("Shift", shiftId.toString());
            }
        }

        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", actorId.toString()));

        Map<AssignmentKey, ShiftAssignment> finalSchedule = assignmentRepository
                .findAllByEmployee_IdInAndWorkDateBetween(
                        employeeIds, from.minusDays(1), to.plusDays(1))
                .stream()
                .collect(Collectors.toMap(
                        assignment -> new AssignmentKey(
                                assignment.getEmployee().getId(), assignment.getWorkDate()),
                        assignment -> assignment
                ));

        List<ShiftAssignment> changedAssignments = new ArrayList<>();
        for (ShiftAssignmentRequest request : requests) {
            AssignmentKey key = new AssignmentKey(request.getEmployeeId(), request.getWorkDate());
            ShiftAssignment assignment = finalSchedule.get(key);
            boolean isNew = assignment == null;

            if (request.getAssignmentStatus() == ShiftAssignmentStatus.CANCELLED
                    && (isNew || assignment.getAssignmentStatus() != ShiftAssignmentStatus.SHIFT)) {
                throw new AppException(HttpStatus.CONFLICT,
                        "Only an existing shift can be cancelled");
            }

            if (isNew) {
                assignment = new ShiftAssignment();
                assignment.setEmployee(employees.get(request.getEmployeeId()));
                assignment.setWorkDate(request.getWorkDate());
                assignment.setAssignedBy(actor);
            }
            assignment.setUpdatedBy(actor);

            if (request.getAssignmentStatus() == ShiftAssignmentStatus.SHIFT) {
                assignment.setShift(shifts.get(request.getShiftId()));
            } else if (request.getAssignmentStatus() == ShiftAssignmentStatus.OFF) {
                assignment.setShift(null);
            }
            // CANCELLED preserves the previous shift for the schedule audit trail.
            assignment.setAssignmentStatus(request.getAssignmentStatus());
            finalSchedule.put(key, assignment);
            changedAssignments.add(assignment);
        }

        validateNoOverlappingShifts(finalSchedule);

        try {
            return assignmentRepository.saveAllAndFlush(changedAssignments)
                    .stream()
                    .map(ShiftAssignmentResponse::from)
                    .toList();
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(HttpStatus.CONFLICT,
                    "The schedule conflicts with another change. Refresh the roster and try again.");
        }
    }

    private void validateRequest(ShiftAssignmentRequest request) {
        if (request == null || request.getEmployeeId() == null || request.getWorkDate() == null
                || request.getAssignmentStatus() == null) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "Each schedule change requires employeeId, workDate, and assignmentStatus");
        }
        if (request.getAssignmentStatus() == ShiftAssignmentStatus.SHIFT && request.getShiftId() == null) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "shiftId is required when assignmentStatus is SHIFT");
        }
        if (request.getAssignmentStatus() == ShiftAssignmentStatus.OFF && request.getShiftId() != null) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "shiftId must be null when assignmentStatus is OFF");
        }
        if (request.getAssignmentStatus() == ShiftAssignmentStatus.CANCELLED && request.getShiftId() != null) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "Do not send shiftId when cancelling; the existing shift is retained for history");
        }
    }

    private void validateDateRange(LocalDate from, LocalDate to) {
        if (from == null || to == null || to.isBefore(from)) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "A valid date range is required; from must be on or before to");
        }
        if (ChronoUnit.DAYS.between(from, to) >= MAX_ROSTER_DAYS) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "A roster request cannot exceed 31 calendar days");
        }
    }

    private void validateNoOverlappingShifts(Map<AssignmentKey, ShiftAssignment> schedule) {
        Map<UUID, List<ShiftWindow>> shiftsByEmployee = new HashMap<>();
        schedule.values().stream()
                .filter(assignment -> assignment.getAssignmentStatus() == ShiftAssignmentStatus.SHIFT
                        && assignment.getShift() != null)
                .forEach(assignment -> shiftsByEmployee
                        .computeIfAbsent(assignment.getEmployee().getId(), ignored -> new ArrayList<>())
                        .add(new ShiftWindow(assignment,
                                assignment.getWorkDate().atTime(assignment.getShift().getStartTime()),
                                shiftEnd(assignment))));

        for (List<ShiftWindow> employeeShifts : shiftsByEmployee.values()) {
            employeeShifts.sort(Comparator.comparing(ShiftWindow::start));
            ShiftWindow furthestEnding = null;
            for (ShiftWindow current : employeeShifts) {
                if (furthestEnding != null && current.start().isBefore(furthestEnding.end())) {
                    ShiftAssignment first = furthestEnding.assignment();
                    ShiftAssignment second = current.assignment();
                    throw new AppException(HttpStatus.CONFLICT,
                            "Employee " + first.getEmployee().getFullName()
                                    + " has overlapping shifts on " + first.getWorkDate()
                                    + " and " + second.getWorkDate());
                }
                if (furthestEnding == null || current.end().isAfter(furthestEnding.end())) {
                    furthestEnding = current;
                }
            }
        }
    }

    private LocalDateTime shiftEnd(ShiftAssignment assignment) {
        LocalDate endDate = assignment.getShift().isOvernight()
                ? assignment.getWorkDate().plusDays(1)
                : assignment.getWorkDate();
        return endDate.atTime(assignment.getShift().getEndTime());
    }

    private record AssignmentKey(UUID employeeId, LocalDate workDate) {}
    private record ShiftWindow(ShiftAssignment assignment, LocalDateTime start, LocalDateTime end) {}
}
