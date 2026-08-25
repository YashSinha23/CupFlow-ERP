package com.cupflow.CupFlow_ERP.order;

import com.cupflow.CupFlow_ERP.bom.BomEntry;
import com.cupflow.CupFlow_ERP.bom.BomRepository;
import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.cup.Cup;
import com.cupflow.CupFlow_ERP.cup.CupRepository;
import com.cupflow.CupFlow_ERP.inventory.*;
import com.cupflow.CupFlow_ERP.user.User;
import com.cupflow.CupFlow_ERP.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final BomRepository bomRepository;
    private final InventoryService inventoryService;
    private final UserRepository userRepository;
    private final CupRepository cupRepository;

    public OrderService(
            OrderRepository orderRepository,
            BomRepository bomRepository,
            InventoryService inventoryService,
            UserRepository userRepository,
            CupRepository cupRepository
    ) {
        this.orderRepository = orderRepository;
        this.bomRepository = bomRepository;
        this.inventoryService = inventoryService;
        this.userRepository = userRepository;
        this.cupRepository = cupRepository;
    }

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyyMMdd");

    private static final Random RANDOM = new Random();


    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, UUID performedBy) {

        String orderCode = generateOrderCode();

        User creator = userRepository.findById(performedBy)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                performedBy.toString()
                        )
                );

        Cup cup = cupRepository.findById(request.getCupId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cup",
                                request.getCupId().toString()
                        )
                );

        Order order = new Order();

        order.setOrderCode(orderCode);
        order.setCustomerName(request.getCustomerName());
        order.setCup(cup);
        order.setCupQuantity(request.getCupQuantity());
        order.setExpectedDelivery(request.getExpectedDelivery());
        order.setCreatedBy(creator);

        order = orderRepository.save(order);

        List<ReservationLine> lines =
                buildReservationLines(
                        request.getCupId(),
                        request.getCupQuantity()
                );

        ReservationResult result =
                inventoryService.evaluateAndReserve(
                        order.getId(),
                        lines,
                        performedBy
                );

        updateStockStatus(order, result);

        order = orderRepository.save(order);

        return OrderResponse.from(
                order,
                getWarnings(order, result),
                result.shortfalls(),
                null
        );
    }


    @Transactional
    public OrderResponse retryReservation(UUID orderId, UUID performedBy) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order",
                                orderId.toString()
                        )
                );

        if (order.getStockStatus() != OrderStockStatus.PENDING_STOCK) {
            throw new AppException(
                    HttpStatus.CONFLICT,
                    "Order is not pending stock"
            );
        }

        List<ReservationLine> lines =
                buildReservationLines(
                        order.getCup().getId(),
                        order.getCupQuantity()
                );

        ReservationResult result =
                inventoryService.evaluateAndReserve(
                        order.getId(),
                        lines,
                        performedBy
                );

        updateStockStatus(order, result);

        order = orderRepository.save(order);

        return OrderResponse.from(
                order,
                getWarnings(order, result),
                result.shortfalls(),
                null
        );
    }


    @Transactional
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(order ->
                        OrderResponse.from(order, null, null, null)
                )
                .toList();
    }


    @Transactional
    public List<OrderResponse> getOrdersByStockStatus(OrderStockStatus stockStatus) {

        return orderRepository.findByStockStatus(stockStatus)
                .stream()
                .map(order ->
                        OrderResponse.from(order, null, null, null)
                )
                .toList();
    }


    @Transactional
    public OrderResponse getOrderById(UUID orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order",
                                orderId.toString()
                        )
                );

        List<StockShortfall> shortfalls = List.of();

        if (order.getStockStatus() == OrderStockStatus.PENDING_STOCK) {
            List<ReservationLine> lines =
                    buildReservationLines(
                            order.getCup().getId(),
                            order.getCupQuantity()
                    );

            shortfalls = inventoryService.getShortfalls(lines);
        }

        return OrderResponse.from(
                order,
                null,
                shortfalls,
                null
        );
    }


    private List<ReservationLine> buildReservationLines(
            UUID cupId,
            Integer cupQuantity
    ) {

        List<BomEntry> bomEntries =
                bomRepository.findByCupIdWithMaterial(cupId);

        if (bomEntries.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No BOM found for cup",
                    cupId.toString()
            );
        }

        return bomEntries.stream()
                .map(entry ->
                        new ReservationLine(
                                entry.getMaterial().getId(),
                                entry.getQtyPerUnit()
                                        .multiply(
                                                BigDecimal.valueOf(cupQuantity)
                                        )
                        )
                )
                .toList();
    }


    private void updateStockStatus(
            Order order,
            ReservationResult result
    ) {

        if (result.outcome() == ReservationOutcome.CONFIRMED) {

            order.setStockStatus(
                    OrderStockStatus.CONFIRMED
            );

            order.setCurrentStage(
                    OrderStage.RAW_MATERIAL_ISSUED
            );

        } else {

            order.setStockStatus(
                    OrderStockStatus.PENDING_STOCK
            );
        }
    }


    private List<LowStockWarning> getWarnings(
            Order order,
            ReservationResult result
    ) {

        if (result.outcome() != ReservationOutcome.CONFIRMED) {
            return List.of();
        }

        return inventoryService.checkThresholds(order.getId());
    }


    public String generateOrderCode() {

        String today =
                LocalDate.now()
                        .format(DATE_FORMATTER);

        for (int attempt = 0; attempt < 3; attempt++) {

            String suffix =
                    String.format(
                            "%04d",
                            RANDOM.nextInt(10000)
                    );

            String candidate =
                    "ORD-" + today + "-" + suffix;

            if (!orderRepository.existsByOrderCode(candidate)) {
                return candidate;
            }
        }

        throw new AppException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to generate unique order code. Please retry"
        );
    }
}