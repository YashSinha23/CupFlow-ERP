package com.cupflow.CupFlow_ERP.cup;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class CupResponse {

    private UUID id;
    private String cupName;
    private Integer cavity;
    private BigDecimal diameter;
    private BigDecimal height;
    private BigDecimal lipSize;

    public static CupResponse from(Cup cup) {
        return new CupResponse(
                cup.getId(),
                cup.getCupName(),
                cup.getCavity(),
                cup.getDiameter(),
                cup.getHeight(),
                cup.getLipSize()
        );
    }
}