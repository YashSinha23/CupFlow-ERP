package com.cupflow.CupFlow_ERP.inventory;

import java.math.BigDecimal;
import java.util.UUID;

public interface StockSummaryProjection {
    UUID getMaterialId();
    String getMaterialType();
    String getUnit();
    BigDecimal getMinThreshold();
    BigDecimal getAvailableStock();
}
