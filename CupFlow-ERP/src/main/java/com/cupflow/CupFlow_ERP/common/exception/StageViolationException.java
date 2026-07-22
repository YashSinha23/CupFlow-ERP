package com.cupflow.CupFlow_ERP.common.exception;

import org.springframework.http.HttpStatus;

public class StageViolationException extends AppException {
    public StageViolationException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}
