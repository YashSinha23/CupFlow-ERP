package com.cupflow.CupFlow_ERP.production;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
public class ProductionStageLogResponse {

    private UUID id;
    private String fromStage;
    private String toStage;
    private Integer quantityReported;
    private String notes;
    private UUID performedBy;
    private String performedByName;
    private OffsetDateTime createdAt;

    public static ProductionStageLogResponse from(ProductionStageLog log, String performedByName) {
        return ProductionStageLogResponse.builder()
                .id(log.getId())
                .fromStage(log.getFromStage().name())
                .toStage(log.getToStage().name())
                .quantityReported(log.getQuantityReported())
                .notes(log.getNotes())
                .performedBy(log.getPerformedBy())
                .performedByName(performedByName)
                .createdAt(log.getCreatedAt())
                .build();
    }
}