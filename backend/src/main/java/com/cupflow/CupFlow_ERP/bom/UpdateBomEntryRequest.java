package com.cupflow.CupFlow_ERP.bom;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class UpdateBomEntryRequest {

    @NotNull(message = "Quantity per unit is required")
    @DecimalMin(value = "0.00001", message = "Quantity per unit must be greater than zero")
    private BigDecimal qtyPerUnit;
}
