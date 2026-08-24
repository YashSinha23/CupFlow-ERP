package com.cupflow.CupFlow_ERP.order;

import com.cupflow.CupFlow_ERP.dispatch.DispatchRecordResponse;
import com.cupflow.CupFlow_ERP.inventory.LowStockWarning;
import com.cupflow.CupFlow_ERP.inventory.StockShortfall;
import java.util.Collections;
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
    private UUID cupId;
    private Integer cupQuantity;
    private LocalDate expectedDelivery;
    private String currentStage;
    private String stockStatus;
    private UUID createdBy;
    private String createdByName;
    private ZonedDateTime createdAt;
    private List<LowStockWarning> lowStockWarnings;
    private List<StockShortfall> shortfalls;
    private DispatchRecordResponse dispatchRecord;

    public static OrderResponse from(
            Order order,
            List<LowStockWarning> warnings,
            List<StockShortfall> shortfalls,
            DispatchRecordResponse dispatchRecord
    ) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerName(order.getCustomerName())
                .cupId(order.getCup().getId())
                .cupQuantity(order.getCupQuantity())
                .expectedDelivery(order.getExpectedDelivery())
                .currentStage(order.getCurrentStage().name())
                .stockStatus(order.getStockStatus().name())
                .createdBy(order.getCreatedBy().getId())
                .createdByName(order.getCreatedBy().getFullName())
                .createdAt(order.getCreatedAt())
                .lowStockWarnings(warnings)
                .shortfalls(shortfalls)
                .dispatchRecord(dispatchRecord)
                .build();
    }

    public static OrderResponse from(Order order, List<LowStockWarning> warnings) {
        return from(order, warnings, Collections.emptyList(), null);
    }

    public static OrderResponse from(Order order) {
        return from(order, Collections.emptyList(), Collections.emptyList(), null);
    }

    public static OrderResponse from(Order order, DispatchRecordResponse dispatchRecord) {
        return from(order, Collections.emptyList(), Collections.emptyList(), dispatchRecord);
    }
}