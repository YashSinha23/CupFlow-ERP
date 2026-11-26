package com.cupflow.CupFlow_ERP.shift;

import com.cupflow.CupFlow_ERP.employee.Employee;
import lombok.Builder;
import lombok.Getter;

import java.util.Locale;
import java.util.UUID;

@Getter
@Builder
public class ShiftEmployeeResponse {

    private UUID id;
    private String employeeCode;
    private String fullName;
    private String jobTitle;
    private String department;

    public static ShiftEmployeeResponse from(Employee employee) {
        return ShiftEmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(String.format(Locale.ROOT, "EMP-%05d", employee.getEmployeeNumber()))
                .fullName(employee.getFullName())
                .jobTitle(employee.getJobTitle())
                .department(employee.getDepartment())
                .build();
    }
}
