package com.cupflow.CupFlow_ERP.shift;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class ShiftResponse {

    private UUID id;
    private String code;
    private String displayName;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean overnight;

    public static ShiftResponse from(Shift shift) {
        return new ShiftResponse(
                shift.getId(),
                shift.getCode(),
                shift.getDisplayName(),
                shift.getStartTime(),
                shift.getEndTime(),
                shift.isOvernight()
        );
    }
}
