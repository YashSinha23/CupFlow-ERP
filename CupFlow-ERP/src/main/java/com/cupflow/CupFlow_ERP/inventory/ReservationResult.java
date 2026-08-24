package com.cupflow.CupFlow_ERP.inventory;

import java.util.List;

public record ReservationResult(
        ReservationOutcome outcome,
        List<StockShortfall> shortfalls
) {}