package com.cupflow.CupFlow_ERP.bom;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CreateBomEntryRequest {

    @NotBlank(message = "Cup type is required")
    @Size(max = 100, message = "Cup type must not exceed 100 chars")
    private String cupType;

    @NotNull(message = "Material ID is required")
    private UUID materialId;

    @NotNull(message = "Quantity per Unit is required")
    @DecimalMin(value = "0.00001", message = "Quantity per unit must be greater than zero")
    private BigDecimal qtyPerUnit;
}
