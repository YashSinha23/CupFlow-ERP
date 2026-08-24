package com.cupflow.CupFlow_ERP.cup;

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
public class CreateCupRequest {

    @NotBlank(message = "Cup name is required")
    @Size(max = 100, message = "Cup name must not exceed 100 chars")
    private String cupName;

    @NotNull(message = "Cavity is required")
    private Integer cavity;

    @NotNull(message = "Diameter is required")
    @DecimalMin(value = "0.00001", message = "Diameter must be greater than zero")
    private BigDecimal diameter;

    @NotNull(message = "Height is required")
    @DecimalMin(value = "0.00001", message = "Height must be greater than zero")
    private BigDecimal height;

    @NotNull(message = "Lip size is required")
    @DecimalMin(value = "0.00001", message = "Lip size must be greater than zero")
    private BigDecimal lipSize;
}