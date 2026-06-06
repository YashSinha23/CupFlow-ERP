package com.cupflow.CupFlow_ERP.material;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import com.cupflow.CupFlow_ERP.material.DTOs.CreateMaterialRequest;
import com.cupflow.CupFlow_ERP.material.DTOs.MaterialResponse;
import com.cupflow.CupFlow_ERP.material.DTOs.UpdateMaterialRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/materials")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MaterialResponse>> create(@Valid @RequestBody CreateMaterialRequest request) {
        MaterialResponse response = materialService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Material created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaterialResponse>> getById(@PathVariable UUID id) {
        MaterialResponse response = materialService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MaterialResponse>>> getAll() {
        List<MaterialResponse> response = materialService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<MaterialResponse>> update(@PathVariable UUID id, @Valid @RequestBody UpdateMaterialRequest request) {
        MaterialResponse response = materialService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Material updated successfully",response));
    }

}
