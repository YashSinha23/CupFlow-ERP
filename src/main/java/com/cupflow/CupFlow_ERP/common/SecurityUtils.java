package com.cupflow.CupFlow_ERP.common;

import com.cupflow.CupFlow_ERP.common.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityUtils {

    private SecurityUtils(){

    }

    public static UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()){
            throw new AppException(HttpStatus.UNAUTHORIZED, "No authenticated user in context.");
        }

        try{
            return UUID.fromString((authentication.getName()));
        } catch (IllegalArgumentException ex){
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid user id in security context.");
        }
    }
}
