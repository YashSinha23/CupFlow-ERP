package com.cupflow.CupFlow_ERP.production;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProductionAssignmentResponse(
        UUID orderId,
        UUID workerId,
        String workerName,
        UUID assignedById,
        String assignedByName,
        OffsetDateTime assignedAt
) {
    public static ProductionAssignmentResponse from(ProductionAssignment assignment) {
        return new ProductionAssignmentResponse(
                assignment.getOrder().getId(),
                assignment.getWorker().getId(),
                assignment.getWorker().getFullName(),
                assignment.getAssignedBy().getId(),
                assignment.getAssignedBy().getFullName(),
                assignment.getAssignedAt()
        );
    }
}
