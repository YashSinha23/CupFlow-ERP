package com.cupflow.CupFlow_ERP.common.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends AppException {

    public ResourceNotFoundException(String resourceName, String id) {
        super(HttpStatus.NOT_FOUND, resourceName + " not found with id: " + id);
    }
}
