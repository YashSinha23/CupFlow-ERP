package com.cupflow.CupFlow_ERP.inventory.DTOs;

import java.math.BigDecimal;
import java.util.UUID;

public interface StockSummaryProjection {
    UUID getMaterialId();
    String getMaterialType();
    String getUnit();
    BigDecimal getMinThreshold();
    BigDecimal getAvailableStock();
}
