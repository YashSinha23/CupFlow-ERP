package com.cupflow.CupFlow_ERP.common.exception;

import org.springframework.http.HttpStatus;

public class InsufficientStockException extends AppException {

    public InsufficientStockException(String materialType, double required, double available) {
        super(HttpStatus.CONFLICT,
                "Insufficient stock for Material " + materialType +
                        " , Required: " + required +
                        " , Available: " +  available);
    }
}
