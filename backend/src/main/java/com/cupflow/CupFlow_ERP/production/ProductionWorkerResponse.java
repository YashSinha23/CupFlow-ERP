package com.cupflow.CupFlow_ERP.production;

import com.cupflow.CupFlow_ERP.user.User;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class ProductionWorkerResponse {

    private UUID id;
    private String fullName;

    public static ProductionWorkerResponse from(User user) {
        return ProductionWorkerResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .build();
    }
}