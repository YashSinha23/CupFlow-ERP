package com.cupflow.CupFlow_ERP.dispatch;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
public class DispatchRecordResponse {
    private UUID id;
    private LocalDate dispatchDate;
    private String transporterName;
    private String vehicleNumber;
    private UUID dispatchedBy;
    private String dispatchedByName;
    private String notes;
    private OffsetDateTime createdAt;

    public static DispatchRecordResponse from(DispatchRecord record) {
        return DispatchRecordResponse.builder()
                .id(record.getId())
                .dispatchDate(record.getDispatchDate())
                .transporterName(record.getTransporterName())
                .vehicleNumber(record.getVehicleNumber())
                .dispatchedBy(record.getDispatchedBy().getId())
                .dispatchedByName(record.getDispatchedBy().getFullName())
                .notes(record.getNotes())
                .createdAt(record.getCreatedAt())
                .build();
    }
}