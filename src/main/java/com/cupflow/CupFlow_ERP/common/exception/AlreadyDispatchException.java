package com.cupflow.CupFlow_ERP.common.exception;

import org.springframework.http.HttpStatus;

public class AlreadyDispatchException extends AppException {
    public AlreadyDispatchException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}
