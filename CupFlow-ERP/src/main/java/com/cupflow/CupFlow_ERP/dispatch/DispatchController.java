package com.cupflow.CupFlow_ERP.dispatch;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import com.cupflow.CupFlow_ERP.common.SecurityUtils;
import com.cupflow.CupFlow_ERP.order.DTOs.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dispatch")
public class DispatchController {
    private final DispatchService dispatchService;

    public DispatchController(DispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @PostMapping("/orders/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<OrderResponse>> dispatch(
            @PathVariable UUID orderId,
            @Valid @RequestBody DispatchRequest request
    ) {
        UUID dispatchedBy = SecurityUtils.getCurrentUserId();
        OrderResponse response = dispatchService.dispatch(orderId, request, dispatchedBy);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
