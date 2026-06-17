package com.cupflow.CupFlow_ERP.order;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import com.cupflow.CupFlow_ERP.common.SecurityUtils;
import com.cupflow.CupFlow_ERP.order.DTOs.CreateOrderRequest;
import com.cupflow.CupFlow_ERP.order.DTOs.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        UUID performedBy = SecurityUtils.getCurrentUserId();
        OrderResponse response = orderService.createOrder(request,  performedBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Order created successfully", response));
    }

}
