package com.cupflow.CupFlow_ERP.bom;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class BomEntryResponse {

    private UUID id;
    private UUID cupId;
    private UUID materialId;
    private String materialType;
    private String unit;
    private BigDecimal qtyPerUnit;

    public static BomEntryResponse from(BomEntry entry) {
        return new BomEntryResponse(
                entry.getId(),
                entry.getCup().getId(),
                entry.getMaterial().getId(),
                entry.getMaterial().getMaterialType(),
                entry.getMaterial().getUnit(),
                entry.getQtyPerUnit()
        );
    }
}