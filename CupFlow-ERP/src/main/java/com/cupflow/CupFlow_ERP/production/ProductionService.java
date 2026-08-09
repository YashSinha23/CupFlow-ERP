package com.cupflow.CupFlow_ERP.production;

import com.cupflow.CupFlow_ERP.common.exception.AlreadyDispatchException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.common.exception.StageViolationException;
import com.cupflow.CupFlow_ERP.order.DTOs.OrderResponse;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.Order;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.OrderStage;
import com.cupflow.CupFlow_ERP.order.Repository.OrderRepository;
import com.cupflow.CupFlow_ERP.user.User;
import com.cupflow.CupFlow_ERP.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductionService {

    private final OrderRepository orderRepository;
    private final ProductionStageLogRepository productionStageLogRepository;
    private final UserRepository userRepository;

    public ProductionService(OrderRepository orderRepository,
                             ProductionStageLogRepository productionStageLogRepository,
                             UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productionStageLogRepository = productionStageLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse advanceStage(UUID orderId, AdvanceStageRequest request, UUID performedBy) {
        // Step 1
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order Not Found with ID: " + orderId));

        OrderStage currentStage = order.getCurrentStage();

        // Step 2
        if (currentStage == OrderStage.READY_TO_DISPATCH) {
            throw new StageViolationException("Order is already at READY_TO_DISPATCH. Use Dispatch Endpoint");
        }

        // Step 3
        if (currentStage == OrderStage.DISPATCHED) {
            throw new AlreadyDispatchException("Order is already DISPATCHED");
        }

        // Step 4
        OrderStage nextStage = OrderStage.values()[currentStage.ordinal() + 1];

        // Step 5
        ProductionStageLog log = new ProductionStageLog();
        log.setOrderId(orderId);
        log.setFromStage(currentStage);
        log.setToStage(nextStage);
        log.setQuantityReported(request.getQuantityReported());
        log.setNotes(request.getNotes());
        log.setPerformedBy(performedBy);
        productionStageLogRepository.save(log);

        // Step 6
        order.setCurrentStage(nextStage);
        Order saved = orderRepository.save(order);

        // Step 7
        return OrderResponse.from(saved);
    }

    @Transactional
    public List<ProductionStageLogResponse> getHistory(UUID orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Order", orderId.toString());
        }

        List<ProductionStageLog> logs = productionStageLogRepository
                .findByOrderIdOrderByCreatedAtAsc(orderId);

        // Collect unique performedBy UUIDs
        List<UUID> userIds = logs.stream()
                .map(ProductionStageLog::getPerformedBy)
                .distinct()
                .collect(Collectors.toList());

        // One query — fetch all referenced users
        Map<UUID, String> userNames = userRepository.findAllById(userIds)
                .stream()
                .collect(Collectors.toMap(User::getId, User::getFullName));

        return logs.stream()
                .map(log -> ProductionStageLogResponse.from(
                        log,
                        userNames.getOrDefault(log.getPerformedBy(), "Unknown")
                ))
                .collect(Collectors.toList());
    }
}