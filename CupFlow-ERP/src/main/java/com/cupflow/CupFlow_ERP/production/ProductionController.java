package com.cupflow.CupFlow_ERP.production;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import com.cupflow.CupFlow_ERP.common.SecurityUtils;
import com.cupflow.CupFlow_ERP.order.DTOs.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/production")
public class ProductionController {

    private final ProductionService productionService;

    public ProductionController(ProductionService productionService) {
        this.productionService = productionService;
    }

    @PostMapping("/orders/{orderId}/advance")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','FLOOR_SUPERVISOR','WORKER')")
    public ResponseEntity<ApiResponse<OrderResponse>> advanceStage(
            @PathVariable UUID orderId,
            @Valid @RequestBody AdvanceStageRequest request) {
        UUID performedBy = SecurityUtils.getCurrentUserId();
        OrderResponse response = productionService.advanceStage(orderId, request, performedBy);
        return ResponseEntity.ok(ApiResponse.success("Order advance to next stage successfully", response));
    }

    @GetMapping("/orders/{orderId}/history")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','FLOOR_SUPERVISOR')")
    public ResponseEntity<ApiResponse<List<ProductionStageLogResponse>>> getHistory(
            @PathVariable UUID orderId) {
        List<ProductionStageLogResponse> history = productionService.getHistory(orderId);
        return ResponseEntity.ok(ApiResponse.success("Stage history fetched successfully", history));
    }
}