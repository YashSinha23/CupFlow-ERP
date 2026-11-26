package com.cupflow.CupFlow_ERP.shift;

import com.cupflow.CupFlow_ERP.common.Response.ApiResponse;
import com.cupflow.CupFlow_ERP.common.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER', 'MANAGER', 'FLOOR_SUPERVISOR')")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShiftResponse>>> getShifts() {
        return ResponseEntity.ok(ApiResponse.success(
                "Shifts fetched successfully",
                shiftService.getShifts()
        ));
    }

    @GetMapping("/employees")
    public ResponseEntity<ApiResponse<List<ShiftEmployeeResponse>>> getActiveEmployees() {
        return ResponseEntity.ok(ApiResponse.success(
                "Active employees fetched successfully",
                shiftService.getActiveEmployees()
        ));
    }

    @GetMapping("/assignments")
    public ResponseEntity<ApiResponse<List<ShiftAssignmentResponse>>> getAssignments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.success(
                "Shift assignments fetched successfully",
                shiftService.getAssignments(from, to)
        ));
    }

    @PutMapping("/assignments")
    public ResponseEntity<ApiResponse<ShiftAssignmentResponse>> saveAssignment(
            @Valid @RequestBody ShiftAssignmentRequest request) {
        ShiftAssignmentResponse assignment = shiftService.saveAssignments(
                List.of(request), SecurityUtils.getCurrentUserId()).getFirst();
        return ResponseEntity.ok(ApiResponse.success(
                "Shift assignment saved successfully",
                assignment
        ));
    }

    @PutMapping("/assignments/bulk")
    public ResponseEntity<ApiResponse<List<ShiftAssignmentResponse>>> saveAssignments(
            @Valid @RequestBody BulkShiftAssignmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Shift assignments saved successfully",
                shiftService.saveAssignments(request.getAssignments(), SecurityUtils.getCurrentUserId())
        ));
    }
}
