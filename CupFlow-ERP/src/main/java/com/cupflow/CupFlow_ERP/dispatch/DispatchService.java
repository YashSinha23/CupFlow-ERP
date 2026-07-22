package com.cupflow.CupFlow_ERP.dispatch;

import com.cupflow.CupFlow_ERP.common.exception.AlreadyDispatchException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.common.exception.StageViolationException;
import com.cupflow.CupFlow_ERP.inventory.InventoryService;
import com.cupflow.CupFlow_ERP.order.DTOs.OrderResponse;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.Order;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.OrderStage;
import com.cupflow.CupFlow_ERP.order.Repository.OrderRepository;
import com.cupflow.CupFlow_ERP.production.ProductionStageLog;
import com.cupflow.CupFlow_ERP.production.ProductionStageLogRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DispatchService {

    private final DispatchRecordRepository dispatchRecordRepository;
    private final OrderRepository orderRepository;
    private final ProductionStageLogRepository  productionStageLogRepository;
    private final InventoryService inventoryService;

    public DispatchService(DispatchRecordRepository dispatchRecordRepository, OrderRepository orderRepository, ProductionStageLogRepository productionStageLogRepository, InventoryService inventoryService) {
        this.dispatchRecordRepository = dispatchRecordRepository;
        this.orderRepository = orderRepository;
        this.productionStageLogRepository = productionStageLogRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public OrderResponse dispatch(UUID orderId, DispatchRequest request, UUID dispatchedBy) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new ResourceNotFoundException("Order", orderId.toString()));

        // Guard 1
        if(order.getCurrentStage() == OrderStage.DISPATCHED) {
            throw new AlreadyDispatchException(orderId.toString());
        }

        // Guard 2
        if(order.getCurrentStage() != OrderStage.READY_TO_DISPATCH) {
            throw new StageViolationException("Order must be at READY_TO_DISPATCH. Current Stage: " + order.getCurrentStage());
        }

        // Step 1
        ProductionStageLog log =  new ProductionStageLog();
        log.setOrderId(orderId);
        log.setFromStage(OrderStage.READY_TO_DISPATCH);
        log.setToStage(OrderStage.DISPATCHED);
        log.setPerformedBy(dispatchedBy);
        productionStageLogRepository.save(log);

        // Step 2
        order.setCurrentStage(OrderStage.DISPATCHED);
        Order savedOrder = orderRepository.save(order);

        // Step 3
        DispatchRecord record = new DispatchRecord();
        record.setOrderId(orderId);
        record.setDispatchDate(request.dispatchDate());
        record.setTransporterName(request.transporterName());
        record.setVehicleNumber(request.vehicleNumber());
        record.setDispatchedBy(dispatchedBy);
        record.setNotes(request.notes());
        DispatchRecord savedRecord = dispatchRecordRepository.save(record);

        // Step 4
        inventoryService.consumeReservations(orderId, dispatchedBy);

        return OrderResponse.from(savedOrder, DispatchRecordResponse.from(savedRecord));
    }
}
