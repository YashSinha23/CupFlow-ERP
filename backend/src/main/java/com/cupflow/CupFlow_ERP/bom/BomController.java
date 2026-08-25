package com.cupflow.CupFlow_ERP.bom;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bom")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class BomController {

    private final BomService bomService;
    public BomController(BomService bomService) {
        this.bomService = bomService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BomEntryResponse>> create(
            @Valid @RequestBody CreateBomEntryRequest request) {
        BomEntryResponse response = bomService.create(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bom entry created successfully", response
                ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<BomEntryResponse>> update(@PathVariable UUID id, @Valid @RequestBody UpdateBomEntryRequest request) {

        BomEntryResponse response = bomService.update(id, request);

        return ResponseEntity.ok(
                ApiResponse.success("Bom entry updated successfully", response
                )
        );
    }

    @GetMapping("/{cupId}")
    public ResponseEntity<ApiResponse<List<BomEntryResponse>>> getEntriesByCupId(@PathVariable UUID cupId) {
        List<BomEntryResponse> response =
                bomService.getEntriesByCupId(cupId);
        return ResponseEntity.ok(
                ApiResponse.success("Bom entries found successfully", response
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        bomService.delete(id);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Bom entry deleted successfully",
                        null
                )
        );
    }
}