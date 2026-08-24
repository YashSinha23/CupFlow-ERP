package com.cupflow.CupFlow_ERP.inventory;

import java.math.BigDecimal;

public record StockShortfall(
        String materialType,
        BigDecimal required,
        BigDecimal available,
        String unit
) {}