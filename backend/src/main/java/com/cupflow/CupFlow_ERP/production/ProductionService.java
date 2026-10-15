package com.cupflow.CupFlow_ERP.production;

import com.cupflow.CupFlow_ERP.common.exception.AlreadyDispatchException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.common.exception.StageViolationException;
import com.cupflow.CupFlow_ERP.order.OrderResponse;
import com.cupflow.CupFlow_ERP.order.Order;
import com.cupflow.CupFlow_ERP.order.OrderStage;
import com.cupflow.CupFlow_ERP.order.OrderRepository;
import com.cupflow.CupFlow_ERP.user.User;
import com.cupflow.CupFlow_ERP.user.UserRepository;
import jakarta.transaction.Transactional;
import com.cupflow.CupFlow_ERP.order.OrderStockStatus;
import com.cupflow.CupFlow_ERP.common.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.cupflow.CupFlow_ERP.user.UserRole;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductionService {

    private final OrderRepository orderRepository;
    private final ProductionStageLogRepository productionStageLogRepository;
    private final UserRepository userRepository;
    private final ProductionAssignmentRepository productionAssignmentRepository;

    public ProductionService(OrderRepository orderRepository,
                             ProductionStageLogRepository productionStageLogRepository,
                             UserRepository userRepository,
                             ProductionAssignmentRepository productionAssignmentRepository) {
        this.orderRepository = orderRepository;
        this.productionStageLogRepository = productionStageLogRepository;
        this.userRepository = userRepository;
        this.productionAssignmentRepository = productionAssignmentRepository;
    }

    @Transactional
    public OrderResponse advanceStage(UUID orderId, AdvanceStageRequest request, UUID performedBy) {
        // Step 1
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order Not Found with ID: " + orderId));

        User performer = userRepository.findById(performedBy)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User Not Found with ID: " + performedBy
                ));

        if (performer.getRole() == UserRole.WORKER) {
            ProductionAssignment assignment = productionAssignmentRepository
                    .findFirstByOrder_IdAndEndedAtIsNull(orderId)
                    .orElseThrow(() -> new AppException(
                            HttpStatus.FORBIDDEN,
                            "You are not assigned to this production order"
                    ));

            if (!assignment.getWorker().getId().equals(performedBy)) {
                throw new AppException(
                        HttpStatus.FORBIDDEN,
                        "You are not assigned to this production order"
                );
            }
        }


        if (order.getStockStatus() != OrderStockStatus.CONFIRMED) {
            throw new AppException(
                    HttpStatus.CONFLICT,
                    "Order stock is not confirmed"
            );
        }

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
    public List<ProductionStageLogResponse> getHistory(UUID orderId, UUID requesterId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Order", orderId.toString());
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User Not Found with ID: " + requesterId
                ));

        if (requester.getRole() == UserRole.WORKER) {
            ProductionAssignment assignment = productionAssignmentRepository
                    .findFirstByOrder_IdAndEndedAtIsNull(orderId)
                    .orElseThrow(() -> new AppException(
                            HttpStatus.FORBIDDEN,
                            "You are not assigned to this production order"
                    ));

            if (!assignment.getWorker().getId().equals(requesterId)) {
                throw new AppException(
                        HttpStatus.FORBIDDEN,
                        "You are not assigned to this production order"
                );
            }
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

    @Transactional
    public List<ProductionOrderResponse> getActiveProductionOrders(UUID requesterId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User Not Found with ID: " + requesterId
                ));

        // Workers can see only orders currently assigned to them.
        if (requester.getRole() == UserRole.WORKER) {
            return productionAssignmentRepository
                    .findByWorker_IdAndEndedAtIsNull(requesterId)
                    .stream()
                    .map(assignment -> ProductionOrderResponse.from(
                            assignment.getOrder(),
                            assignment
                    ))
                    .toList();
        }

        // Admin, Manager, and Floor Supervisor see the whole production board.
        List<Order> orders = orderRepository
                .findByCurrentStageNotOrderByExpectedDeliveryAsc(OrderStage.DISPATCHED);

        if (orders.isEmpty()) {
            return List.of();
        }

        List<UUID> orderIds = orders.stream()
                .map(Order::getId)
                .toList();

        Map<UUID, ProductionAssignment> assignmentsByOrderId =
                productionAssignmentRepository
                        .findByOrder_IdInAndEndedAtIsNull(orderIds)
                        .stream()
                        .collect(Collectors.toMap(
                                assignment -> assignment.getOrder().getId(),
                                assignment -> assignment
                        ));

        return orders.stream()
                .map(order -> ProductionOrderResponse.from(
                        order,
                        assignmentsByOrderId.get(order.getId())
                ))
                .toList();
    }

    @Transactional
    public List<ProductionWorkerResponse> getEligibleWorkers() {
        return userRepository
                .findByRoleAndActiveTrueOrderByFullNameAsc(UserRole.WORKER)
                .stream()
                .map(ProductionWorkerResponse::from)
                .toList();
    }

    @Transactional
    public ProductionAssignmentResponse assignWorker(UUID orderId, UUID workerId, UUID assignedById) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order Not Found with ID: " + orderId));

        if (order.getStockStatus() != OrderStockStatus.CONFIRMED) {
            throw new AppException(HttpStatus.CONFLICT, "Order stock must be confirmed before assigning production work");
        }

        if (order.getCurrentStage() == OrderStage.READY_TO_DISPATCH
                || order.getCurrentStage() == OrderStage.DISPATCHED) {
            throw new StageViolationException("A worker can only be assigned while the order is in production");
        }

        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker Not Found with ID: " + workerId));
        if (!worker.isActive() || worker.getRole() != UserRole.WORKER) {
            throw new AppException(HttpStatus.BAD_REQUEST, "The selected user must be an active worker");
        }

        User assignedBy = userRepository.findById(assignedById)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found with ID: " + assignedById));

        var currentAssignment = productionAssignmentRepository
                .findFirstByOrder_IdAndEndedAtIsNull(orderId);

        if (currentAssignment.isPresent()
                && currentAssignment.get().getWorker().getId().equals(workerId)) {
            return ProductionAssignmentResponse.from(currentAssignment.get());
        }

        currentAssignment.ifPresent(assignment -> {
            assignment.setEndedAt(OffsetDateTime.now());
            assignment.setEndedBy(assignedBy);
            productionAssignmentRepository.save(assignment);
        });

        ProductionAssignment assignment = new ProductionAssignment();
        assignment.setOrder(order);
        assignment.setWorker(worker);
        assignment.setAssignedBy(assignedBy);
        ProductionAssignment savedAssignment = productionAssignmentRepository.save(assignment);

        return ProductionAssignmentResponse.from(savedAssignment);
    }
}
