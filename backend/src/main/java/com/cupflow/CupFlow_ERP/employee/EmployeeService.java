package com.cupflow.CupFlow_ERP.employee;

import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.production.ProductionAssignment;
import com.cupflow.CupFlow_ERP.production.ProductionAssignmentRepository;
import com.cupflow.CupFlow_ERP.user.User;
import com.cupflow.CupFlow_ERP.user.UserRepository;
import com.cupflow.CupFlow_ERP.user.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final ProductionAssignmentRepository productionAssignmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           UserRepository userRepository,
                           ProductionAssignmentRepository productionAssignmentRepository) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.productionAssignmentRepository = productionAssignmentRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getEmployees(String search, String department, EmploymentStatus status) {
        String query = normalizeSearch(search);
        String departmentFilter = normalizeSearch(department);

        return employeeRepository.findAllByOrderByEmployeeNumberAsc().stream()
                .filter(employee -> status == null || employee.getStatus() == status)
                .filter(employee -> departmentFilter == null
                        || employee.getDepartment().equalsIgnoreCase(departmentFilter))
                .filter(employee -> matchesSearch(employee, query))
                .map(EmployeeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployee(UUID id) {
        return EmployeeResponse.from(findEmployee(id));
    }

    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        Employee employee = new Employee();
        applyProfile(employee, request.getFullName(), request.getJobTitle(), request.getDepartment(),
                request.getDateOfJoining(), request.getContactPhone(), request.getContactEmail());
        employee.setStatus(EmploymentStatus.ACTIVE);
        employee.setLoginDisabledByEmployment(false);
        return EmployeeResponse.from(employeeRepository.saveAndFlush(employee));
    }

    @Transactional
    public EmployeeResponse updateEmployee(UUID id, UpdateEmployeeRequest request) {
        Employee employee = findEmployee(id);
        applyProfile(employee, request.getFullName(), request.getJobTitle(), request.getDepartment(),
                request.getDateOfJoining(), request.getContactPhone(), request.getContactEmail());

        if (employee.getUser() != null) {
            employee.getUser().setFullName(employee.getFullName());
        }

        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse updateStatus(UUID id, UpdateEmployeeStatusRequest request,
                                         UUID actorId, UserRole actorRole) {
        Employee employee = findEmployee(id);
        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", actorId.toString()));

        if (request.isReactivateLogin() && actorRole != UserRole.ADMIN) {
            throw new AppException(HttpStatus.FORBIDDEN,
                    "Only an administrator can reactivate a linked login account");
        }

        if (request.getStatus() == employee.getStatus()) {
            if (request.isReactivateLogin()) {
                throw new AppException(HttpStatus.BAD_REQUEST,
                        "Login reactivation can only be requested while reactivating an employee");
            }
            return EmployeeResponse.from(employee);
        }

        if (request.getStatus() == EmploymentStatus.INACTIVE) {
            deactivateEmployee(employee, actor);
        } else {
            activateEmployee(employee, request.isReactivateLogin());
        }

        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse linkLoginAccount(UUID employeeId, UUID userId) {
        Employee employee = findEmployee(employeeId);
        if (employee.getStatus() != EmploymentStatus.ACTIVE) {
            throw new AppException(HttpStatus.CONFLICT,
                    "A login account can only be linked to an active employee");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));
        employeeRepository.findByUser_Id(userId).ifPresent(existingEmployee -> {
            if (!existingEmployee.getId().equals(employeeId)) {
                throw new AppException(HttpStatus.CONFLICT,
                        "This login account is already linked to another employee");
            }
        });

        employee.setUser(user);
        employee.setLoginDisabledByEmployment(false);
        user.setFullName(employee.getFullName());
        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse unlinkLoginAccount(UUID employeeId) {
        Employee employee = findEmployee(employeeId);
        employee.setUser(null);
        employee.setLoginDisabledByEmployment(false);
        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    private void deactivateEmployee(Employee employee, User actor) {
        employee.setStatus(EmploymentStatus.INACTIVE);

        User linkedUser = employee.getUser();
        if (linkedUser == null) {
            employee.setLoginDisabledByEmployment(false);
            return;
        }

        if (linkedUser.isActive()) {
            linkedUser.setActive(false);
            employee.setLoginDisabledByEmployment(true);
        } else {
            employee.setLoginDisabledByEmployment(false);
        }

        OffsetDateTime endedAt = OffsetDateTime.now();
        List<ProductionAssignment> activeAssignments =
                productionAssignmentRepository.findByWorker_IdAndEndedAtIsNull(linkedUser.getId());
        for (ProductionAssignment assignment : activeAssignments) {
            assignment.setEndedAt(endedAt);
            assignment.setEndedBy(actor);
        }
    }

    private void activateEmployee(Employee employee, boolean reactivateLogin) {
        User linkedUser = employee.getUser();
        boolean loginWasDisabledByEmployment = employee.isLoginDisabledByEmployment();

        if (reactivateLogin && !loginWasDisabledByEmployment) {
            throw new AppException(HttpStatus.CONFLICT,
                    "This login was not disabled by employee deactivation. Reactivate it from User Accounts if appropriate.");
        }
        if (reactivateLogin && linkedUser == null) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "This employee does not have a linked login account");
        }

        employee.setStatus(EmploymentStatus.ACTIVE);
        if (reactivateLogin) {
            linkedUser.setActive(true);
        }
        employee.setLoginDisabledByEmployment(false);
    }

    private void applyProfile(Employee employee, String fullName, String jobTitle,
                              String department, java.time.LocalDate dateOfJoining,
                              String contactPhone, String contactEmail) {
        employee.setFullName(fullName.trim());
        employee.setJobTitle(jobTitle.trim());
        employee.setDepartment(department.trim());
        employee.setDateOfJoining(dateOfJoining);
        employee.setContactPhone(blankToNull(contactPhone));
        employee.setContactEmail(blankToNull(contactEmail));
    }

    private Employee findEmployee(UUID id) {
        return employeeRepository.findEmployeeWithUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", id.toString()));
    }

    private boolean matchesSearch(Employee employee, String query) {
        if (query == null) return true;
        User user = employee.getUser();
        return contains(employee.getFullName(), query)
                || contains(employee.getJobTitle(), query)
                || contains(employee.getDepartment(), query)
                || contains(employee.getContactEmail(), query)
                || contains(employee.getContactPhone(), query)
                || formatEmployeeCode(employee.getEmployeeNumber()).toLowerCase(Locale.ROOT).contains(query)
                || (user != null && contains(user.getEmail(), query));
    }

    private String normalizeSearch(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String formatEmployeeCode(Long employeeNumber) {
        return String.format(Locale.ROOT, "EMP-%05d", employeeNumber);
    }
}
