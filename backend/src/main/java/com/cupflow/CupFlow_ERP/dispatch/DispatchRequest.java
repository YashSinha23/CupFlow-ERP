package com.cupflow.CupFlow_ERP.dispatch;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DispatchRequest(
        @NotNull(message = "Dispatch date is required")
        LocalDate dispatchDate,

        String transporterName,

        String vehicleNumber,

        String notes
) {
}
