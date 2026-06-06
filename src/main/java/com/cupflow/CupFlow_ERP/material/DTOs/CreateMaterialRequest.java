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
public class CreateMaterialRequest {

    @NotBlank(message = "Material type is required")
    @Size(max = 255, message = "Material type must not exceed 255 char")
    private String materialType;

    @NotBlank(message = "Unit is required")
    @Size(max = 20, message = "Unit must not exceed 20 char")
    private String unit;

    @NotNull(message = "Min Threshold is required")
    @DecimalMin(value = "0.0", message = "Min Threshold cannot be negative")
    private BigDecimal minThreshold;
}
