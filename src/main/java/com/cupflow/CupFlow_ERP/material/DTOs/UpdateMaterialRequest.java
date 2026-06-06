package com.cupflow.CupFlow_ERP.material.DTOs;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class UpdateMaterialRequest {

    @NotBlank(message = "Unit is required")
    @Size(max = 20, message = "Unit cannot exceed 20 char")
    private String unit;

    @NotNull(message = "Min threshold is required")
    @DecimalMin(value = "0.0", message = "Min threshold cannot be nagative")
    private BigDecimal minThreshold;
}
