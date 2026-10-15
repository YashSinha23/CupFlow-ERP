package com.cupflow.CupFlow_ERP.production;

import com.cupflow.CupFlow_ERP.order.Order;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@Getter
public class ProductionOrderResponse {

    private UUID id;
    private String orderCode;
    private String cupName;
    private Integer cupQuantity;
    private LocalDate expectedDelivery;
    private String currentStage;
    private String stockStatus;
    private UUID assignedWorkerId;
    private String assignedWorkerName;

    public static ProductionOrderResponse from(
            Order order,
            ProductionAssignment assignment
    ) {
        return ProductionOrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .cupName(order.getCup().getCupName())
                .cupQuantity(order.getCupQuantity())
                .expectedDelivery(order.getExpectedDelivery())
                .currentStage(order.getCurrentStage().name())
                .stockStatus(order.getStockStatus().name())
                .assignedWorkerId(
                        assignment == null ? null : assignment.getWorker().getId()
                )
                .assignedWorkerName(
                        assignment == null ? null : assignment.getWorker().getFullName()
                )
                .build();
    }
}
