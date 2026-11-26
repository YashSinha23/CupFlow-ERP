package com.cupflow.CupFlow_ERP.employee;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    @EntityGraph(attributePaths = "user")
    List<Employee> findAllByOrderByEmployeeNumberAsc();

    @EntityGraph(attributePaths = "user")
    Optional<Employee> findEmployeeWithUserById(UUID id);

    Optional<Employee> findByUser_Id(UUID userId);
}
