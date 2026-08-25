package com.cupflow.CupFlow_ERP.order;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import com.cupflow.CupFlow_ERP.common.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request
    ) {

        UUID performedBy = SecurityUtils.getCurrentUserId();

        OrderResponse response =
                orderService.createOrder(
                        request,
                        performedBy
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Order created successfully",
                        response
                ));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable UUID id
    ) {

        OrderResponse response =
                orderService.getOrderById(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success(
                        "Order found successfully",
                        response
                ));
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStockStatus stockStatus
    ) {

        List<OrderResponse> orders =
                stockStatus == null
                        ? orderService.getAllOrders()
                        : orderService.getOrdersByStockStatus(stockStatus);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success(
                        "Orders found successfully",
                        orders
                ));
    }


    @PostMapping("/{orderId}/retry-reservation")
    public ResponseEntity<ApiResponse<OrderResponse>> retryReservation(
            @PathVariable UUID orderId
    ) {

        UUID performedBy = SecurityUtils.getCurrentUserId();

        OrderResponse response =
                orderService.retryReservation(
                        orderId,
                        performedBy
                );

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success(
                        "Reservation retry completed",
                        response
                ));
    }
}