package com.cupflow.CupFlow_ERP.cup;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cups")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class CupController {

    private final CupService cupService;

    public CupController(CupService cupService) {
        this.cupService = cupService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CupResponse>> create(
            @Valid @RequestBody CreateCupRequest request) {

        CupResponse response = cupService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Cup created successfully",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CupResponse>>> getAll() {

        List<CupResponse> response = cupService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success(response)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CupResponse>> getById(
            @PathVariable UUID id) {

        CupResponse response = cupService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success(response)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<CupResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCupRequest request) {

        CupResponse response = cupService.update(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Cup updated successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id) {

        cupService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Cup deleted successfully",
                        null
                )
        );
    }
}