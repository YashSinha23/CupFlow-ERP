package com.cupflow.CupFlow_ERP.inventory.DTOs;

import java.math.BigDecimal;
import java.util.UUID;

public class StockSummaryResponse {

    private UUID materialId;
    private String materialType;
    private String unit;
    private BigDecimal availableStock;
    private BigDecimal minThreshold;
    private boolean belowThreshold;

    public StockSummaryResponse(StockSummaryProjection projection) {
        this.materialId = projection.getMaterialId();
        this.materialType = projection.getMaterialType();
        this.unit = projection.getUnit();
        this.availableStock = projection.getAvailableStock();
        this.minThreshold = projection.getMinThreshold();
        this.belowThreshold = this.availableStock.compareTo(this.minThreshold) < 0;
    }

    public UUID getMaterialId() { return materialId; }
    public String getMaterialType() { return materialType; }
    public String getUnit() { return unit; }
    public BigDecimal getAvailableStock() { return availableStock; }
    public BigDecimal getMinThreshold() { return minThreshold; }
    public boolean isBelowThreshold() { return belowThreshold; }
}