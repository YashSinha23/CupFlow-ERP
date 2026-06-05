package com.cupflow.CupFlow_ERP.inventory.Repository;

import com.cupflow.CupFlow_ERP.inventory.EnumsEntity.StockLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface StockLedgerRepository extends JpaRepository<StockLedger, UUID> {


    @Query("""
        SELECT COALESCE(SUM(sl.quantity),0)
        FROM StockLedger sl
        WHERE sl.material.id = :materialId
        AND sl.movementType IN ('STOCK_IN','RESERVED')
""")
    BigDecimal getAvailableStock(@Param("materialId") UUID materialId);

    List<StockLedger> findByOrderId(UUID orderId);
}
