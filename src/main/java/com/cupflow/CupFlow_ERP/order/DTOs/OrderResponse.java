package com.cupflow.CupFlow_ERP.order.DTOs;


import com.cupflow.CupFlow_ERP.inventory.Record.LowStockWarning;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.Order;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class OrderResponse {

    private UUID id;
    private String orderCode;
    private String customerName;
    private String cupType;
    private Integer cupQuantity;
    private LocalDate expectedDelivery;
    private String currentStage;
    private String stockStatus;
    private UUID createdBy;
    private ZonedDateTime createdAt;
    private List<LowStockWarning> lowStockWarnings;

    public static OrderResponse from(Order order, List<LowStockWarning> warnings) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerName(order.getCustomerName())
                .cupType(order.getCupType())
                .cupQuantity(order.getCupQuantity())
                .expectedDelivery(order.getExpectedDelivery())
                .currentStage(order.getCurrentStage().name())
                .stockStatus(order.getStockStatus().name())
                .createdBy(order.getCreatedBy())
                .createdAt(order.getCreatedAt())
                .lowStockWarnings(warnings)
                .build();
    }
}