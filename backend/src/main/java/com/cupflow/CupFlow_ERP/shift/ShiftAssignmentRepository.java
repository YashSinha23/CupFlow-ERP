package com.cupflow.CupFlow_ERP.shift;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, UUID> {

    @EntityGraph(attributePaths = {"employee", "shift", "assignedBy", "updatedBy"})
    List<ShiftAssignment> findAllByWorkDateBetweenOrderByWorkDateAscEmployee_EmployeeNumberAsc(
            LocalDate from,
            LocalDate to
    );

    @EntityGraph(attributePaths = {"employee", "shift", "assignedBy", "updatedBy"})
    List<ShiftAssignment> findAllByEmployee_IdInAndWorkDateBetween(
            List<UUID> employeeIds,
            LocalDate from,
            LocalDate to
    );

    @EntityGraph(attributePaths = {"employee", "shift"})
    Optional<ShiftAssignment> findByEmployee_IdAndWorkDate(UUID employeeId, LocalDate workDate);

    @EntityGraph(attributePaths = {"shift"})
    List<ShiftAssignment> findAllByEmployee_IdAndWorkDateGreaterThanEqualAndAssignmentStatus(
            UUID employeeId,
            LocalDate workDate,
            ShiftAssignmentStatus assignmentStatus
    );
}
