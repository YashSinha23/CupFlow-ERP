package com.cupflow.CupFlow_ERP.inventory;

import java.math.BigDecimal;
import java.util.UUID;

public record ReservationLine(UUID materialId, BigDecimal requiredQty) {
}
