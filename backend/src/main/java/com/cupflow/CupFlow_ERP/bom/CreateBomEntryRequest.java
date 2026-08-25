package com.cupflow.CupFlow_ERP.bom;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CreateBomEntryRequest {

    @NotNull(message = "Cup ID is required")
    private UUID cupId;

    @NotNull(message = "Material ID is required")
    private UUID materialId;

    @NotNull(message = "Quantity per Unit is required")
    @DecimalMin(value = "0.00001", message = "Quantity per unit must be greater than zero")
    private BigDecimal qtyPerUnit;
}