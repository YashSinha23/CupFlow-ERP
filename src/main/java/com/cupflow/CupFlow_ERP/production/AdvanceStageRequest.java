package com.cupflow.CupFlow_ERP.production;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdvanceStageRequest {

    @Min(value = 1, message = "Quantity reported must be greated than 1 if provided")
    private Integer quantityReported;

    private String notes;

}
