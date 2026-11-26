package com.cupflow.CupFlow_ERP.shift;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class ShiftAssignmentRequest {

    @NotNull
    private UUID employeeId;

    @NotNull
    private LocalDate workDate;

    private UUID shiftId;

    @NotNull
    private ShiftAssignmentStatus assignmentStatus;
}
