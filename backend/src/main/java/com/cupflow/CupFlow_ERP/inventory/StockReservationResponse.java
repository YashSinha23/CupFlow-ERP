package com.cupflow.CupFlow_ERP.inventory;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record StockReservationResponse(
        UUID id,
        UUID orderId,
        UUID materialId,
        String materialType,
        String unit,
        BigDecimal reservedQty,
        ReservationStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime consumedAt
) {
    public static StockReservationResponse from(StockReservation reservation) {
        return new StockReservationResponse(
                reservation.getId(),
                reservation.getOrderId(),
                reservation.getMaterial().getId(),
                reservation.getMaterial().getMaterialType(),
                reservation.getMaterial().getUnit(),
                reservation.getReservedQty(),
                reservation.getStatus(),
                reservation.getCreatedAt(),
                reservation.getConsumedAt()
        );
    }
}