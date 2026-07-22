package com.cupflow.CupFlow_ERP.inventory;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import com.cupflow.CupFlow_ERP.common.SecurityUtils;
import com.cupflow.CupFlow_ERP.inventory.DTOs.StockSummaryResponse;
import com.cupflow.CupFlow_ERP.inventory.Record.StockLedgerRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER','FLOOR_SUPERVISOR')")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }


    @GetMapping("/stock")
    public ApiResponse<List<StockSummaryResponse>> getStockSummary() {
        return ApiResponse.success(inventoryService.getStockSummary());
    }


    @PostMapping("/stock-in")
    public ResponseEntity<ApiResponse<String>> stockIn(@RequestParam UUID orderId, @RequestBody StockLedgerRequest request) {

        UUID performedBy = SecurityUtils.getCurrentUserId();
        inventoryService.recordStockIn(orderId, request, performedBy);
        return ResponseEntity.ok(ApiResponse.success("Stock recorded successfully"));

    }
}
