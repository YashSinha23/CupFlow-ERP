package com.cupflow.CupFlow_ERP.common.exception;

import org.springframework.http.HttpStatus;

public class AlreadyDispatchException extends AppException {
    public AlreadyDispatchException(String orderId) {
        super(HttpStatus.CONFLICT,
                "Order " + orderId +
                " has already been dispatched.");
    }
}
