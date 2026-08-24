package com.cupflow.CupFlow_ERP.inventory;

import java.math.BigDecimal;
import java.util.UUID;

public record StockLedgerRequest(
        UUID materialId,
        BigDecimal quantity,
        String supplierName,
        String notes
) {
}
