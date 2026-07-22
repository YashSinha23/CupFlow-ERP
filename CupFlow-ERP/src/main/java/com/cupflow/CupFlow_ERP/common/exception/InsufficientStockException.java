package com.cupflow.CupFlow_ERP.common.exception;

import org.springframework.http.HttpStatus;

import java.math.BigDecimal;

public class InsufficientStockException extends AppException {

    public InsufficientStockException(String materialType, BigDecimal required, BigDecimal available) {
        super(HttpStatus.CONFLICT,
                "Insufficient stock for Material " + materialType +
                        " , Required: " + required +
                        " , Available: " +  available);
    }
}
