package com.cupflow.CupFlow_ERP.production;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignProductionOrderRequest(
        @NotNull UUID workerId
) {}
