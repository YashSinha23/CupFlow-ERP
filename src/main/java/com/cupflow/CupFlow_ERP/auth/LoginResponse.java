package com.cupflow.CupFlow_ERP.auth;

import lombok.Getter;

import java.util.UUID;

@Getter
public class LoginResponse {

    private String token;
    private String role;
    private UUID userId;

    public LoginResponse(String token, String role, UUID userId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
    }
}
