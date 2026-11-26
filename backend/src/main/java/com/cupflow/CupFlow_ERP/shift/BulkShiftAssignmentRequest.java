package com.cupflow.CupFlow_ERP.shift;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkShiftAssignmentRequest {

    @NotEmpty
    @Size(max = 1000)
    private List<@Valid ShiftAssignmentRequest> assignments;
}
