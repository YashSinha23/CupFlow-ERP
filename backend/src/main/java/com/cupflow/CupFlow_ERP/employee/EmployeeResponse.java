package com.cupflow.CupFlow_ERP.employee;

import com.cupflow.CupFlow_ERP.user.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

@Getter
@Builder
public class EmployeeResponse {

    private UUID id;
    private String employeeCode;
    private String fullName;
    private String jobTitle;
    private String department;
    private LocalDate dateOfJoining;
    private String contactPhone;
    private String contactEmail;
    private EmploymentStatus status;
    private boolean loginAccountLinked;
    private boolean loginDisabledByEmployment;
    private String loginEmail;
    private String loginRole;
    private Boolean loginActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public static EmployeeResponse from(Employee employee) {
        User user = employee.getUser();
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(String.format(Locale.ROOT, "EMP-%05d", employee.getEmployeeNumber()))
                .fullName(employee.getFullName())
                .jobTitle(employee.getJobTitle())
                .department(employee.getDepartment())
                .dateOfJoining(employee.getDateOfJoining())
                .contactPhone(employee.getContactPhone())
                .contactEmail(employee.getContactEmail())
                .status(employee.getStatus())
                .loginAccountLinked(user != null)
                .loginDisabledByEmployment(employee.isLoginDisabledByEmployment())
                .loginEmail(user == null ? null : user.getEmail())
                .loginRole(user == null ? null : user.getRole().name())
                .loginActive(user == null ? null : user.isActive())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}
