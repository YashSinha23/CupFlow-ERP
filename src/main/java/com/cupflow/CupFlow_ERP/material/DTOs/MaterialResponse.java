package com.cupflow.CupFlow_ERP.material.DTOs;

import com.cupflow.CupFlow_ERP.material.Entity.Material;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class MaterialResponse {


    private UUID id;
    private String materialType;
    private String unit;
    private BigDecimal minThreshold;
    private OffsetDateTime createdAt;

    public static MaterialResponse from(Material material){
        return new MaterialResponse(
                material.getId(),
                material.getMaterialType(),
                material.getUnit(),
                material.getMinThreshold(),
                material.getCreatedAt()
        );
    }
}
