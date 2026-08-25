package com.cupflow.CupFlow_ERP.order;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class CreateOrderRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotNull(message = "Cup ID is required")
    private UUID cupId;

    @NotNull(message = "Cup quantity is required")
    @Min(value = 1, message = "Cup quantity must be at least 1")
    private Integer cupQuantity;

    @NotNull(message = "Expected delivery date is required")
    @Future(message = "Expected delivery date must be in the future")
    private LocalDate expectedDelivery;
}