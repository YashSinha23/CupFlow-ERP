package com.cupflow.CupFlow_ERP.employee;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class LinkEmployeeLoginRequest {

    @NotNull(message = "User account is required")
    private UUID userId;
}
