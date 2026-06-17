package com.cupflow.CupFlow_ERP.production;

import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.common.exception.StageViolationException;
import com.cupflow.CupFlow_ERP.order.DTOs.OrderResponse;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.Order;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.OrderStage;
import com.cupflow.CupFlow_ERP.order.Repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProductionService {

    private final OrderRepository orderRepository;
    private final ProductionStageLogRepository productionStageLogRepository;

    public ProductionService(OrderRepository orderRepository, ProductionStageLogRepository productionStageLogRepository) {
        this.orderRepository = orderRepository;
        this.productionStageLogRepository = productionStageLogRepository;
    }

    public OrderResponse advanceStage(UUID orderId, AdvanceStageRequest request, UUID performedBy) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order Not Found with ID: " + orderId));

        OrderStage currentStage = order.getCurrentStage();

        if(currentStage == OrderStage.READY_TO_DISPATCH) {
            throw new StageViolationException("Order is already at Ready to Dispatch. Use Dispatch Endpoint");
        }

        if(currentStage == OrderStage.DISPATCHED) {
            throw new StageViolationException("Order is already dispatched");
        }

        OrderStage nextStage = OrderStage.values()[currentStage.ordinal() + 1];

        ProductionStageLog log = new ProductionStageLog();
        log.setOrderId(orderId);
        log.setFromStage(currentStage);
        log.setToStage(nextStage);
        log.setQuantityReported(request.getQuantityReported());
        log.setNotes(request.getNotes());
        log.setPerformedBy(performedBy);
        productionStageLogRepository.save(log);

        order.setCurrentStage(nextStage);
        Order saved = orderRepository.save(order);

        return OrderResponse.from(saved);
    }
}
