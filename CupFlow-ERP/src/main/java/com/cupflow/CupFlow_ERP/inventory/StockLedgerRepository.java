package com.cupflow.CupFlow_ERP.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface StockLedgerRepository extends JpaRepository<StockLedger, UUID> {

    @Query(value = """
        SELECT  m.id AS materialId,
                m.material_type AS material_type,
                m.unit AS unit,
                m.min_threshold AS minThreshold,
                COALESCE(SUM(sl.quantity),0) AS availableStock
        FROM materials m
        LEFT JOIN stock_ledger sl ON sl.material_id = m.id
        AND sl.movement_type IN('STOCK_IN','RESERVED')
        GROUP BY m.id, m.material_type, m.unit, m.min_threshold
""", nativeQuery = true)
    List<StockSummaryProjection> getStockSummary();

    @Query("""
        SELECT COALESCE(SUM(sl.quantity),0)
        FROM StockLedger sl
        WHERE sl.material.id = :materialId
        AND sl.movementType IN ('STOCK_IN','RESERVED')
""")
    BigDecimal getAvailableStock(@Param("materialId") UUID materialId);

    List<StockLedger> findByOrderId(UUID orderId);
}
