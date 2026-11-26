package com.cupflow.CupFlow_ERP.employee;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEmployeeStatusRequest {

    @NotNull(message = "Employment status is required")
    private EmploymentStatus status;

    private boolean reactivateLogin;
}
