package com.cupflow.CupFlow_ERP.inventory.Record;

import java.math.BigDecimal;

public record LowStockWarning(
        String materialType,
        BigDecimal availableQty,
        BigDecimal minThreshold,
        String unit
) {
}
