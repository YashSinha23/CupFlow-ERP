package com.cupflow.CupFlow_ERP.inventory;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record StockMovementResponse(
        UUID id,
        UUID materialId,
        String materialType,
        String unit,
        MovementType movementType,
        BigDecimal quantity,
        UUID orderId,
        String supplierName,
        UUID performedBy,
        String notes,
        OffsetDateTime createdAt
) {
    public static StockMovementResponse from(StockLedger entry) {
        return new StockMovementResponse(
                entry.getId(),
                entry.getMaterial().getId(),
                entry.getMaterial().getMaterialType(),
                entry.getMaterial().getUnit(),
                entry.getMovementType(),
                entry.getQuantity(),
                entry.getOrderId(),
                entry.getSupplierName(),
                entry.getPerformedBy(),
                entry.getNotes(),
                entry.getCreatedAt()
        );
    }
}