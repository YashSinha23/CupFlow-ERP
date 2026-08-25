package com.cupflow.CupFlow_ERP.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface StockReservationRepository extends JpaRepository<StockReservation, UUID> {
    List<StockReservation> findByOrderIdAndStatus(UUID orderId, ReservationStatus status);

    @Modifying
    @Query("""
            UPDATE StockReservation sr
            SET sr.status = :status,
            sr.consumedAt = :consumedAt
            WHERE sr.orderId = :orderId
            AND sr.status = 'ACTIVE'
        """)
    int updateStatusByOrderId(
            @Param("orderId") UUID orderId,
            @Param("status") ReservationStatus status,
            @Param("consumedAt") OffsetDateTime consumedAt
    );
}
