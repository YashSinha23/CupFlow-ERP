package com.cupflow.CupFlow_ERP.common;

import com.cupflow.CupFlow_ERP.common.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import com.cupflow.CupFlow_ERP.user.UserRole;

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

    public static UserRole getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "No authenticated user in context.");
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring("ROLE_".length()))
                .map(UserRole::valueOf)
                .findFirst()
                .orElseThrow(() -> new AppException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "No application role found in security context."));
    }
}
