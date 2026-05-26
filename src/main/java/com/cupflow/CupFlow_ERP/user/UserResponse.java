package com.cupflow.CupFlow_ERP.user;

import java.time.ZonedDateTime;
import java.util.UUID;

public class UserResponse {

    private UUID id;
    private String email;
    private String role;
    private boolean active;
    private UUID createdBy;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.active = user.isActive();
        this.createdBy = user.getCreatedBy() != null ? user.getCreatedBy().getId() : null;
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }
    public UUID getCreatedBy() { return createdBy; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
    public ZonedDateTime getUpdatedAt() { return updatedAt; }

}
