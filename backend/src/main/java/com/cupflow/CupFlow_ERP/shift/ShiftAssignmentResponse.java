package com.cupflow.CupFlow_ERP.shift;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

@Getter
@Builder
public class ShiftAssignmentResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String department;
    private LocalDate workDate;
    private ShiftAssignmentStatus assignmentStatus;
    private UUID shiftId;
    private String shiftCode;
    private String shiftName;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean overnight;
    private UUID assignedById;
    private String assignedByName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private UUID updatedById;
    private String updatedByName;

    public static ShiftAssignmentResponse from(ShiftAssignment assignment) {
        Shift shift = assignment.getShift();
        return ShiftAssignmentResponse.builder()
                .id(assignment.getId())
                .employeeId(assignment.getEmployee().getId())
                .employeeCode(String.format(Locale.ROOT, "EMP-%05d",
                        assignment.getEmployee().getEmployeeNumber()))
                .employeeName(assignment.getEmployee().getFullName())
                .department(assignment.getEmployee().getDepartment())
                .workDate(assignment.getWorkDate())
                .assignmentStatus(assignment.getAssignmentStatus())
                .shiftId(shift == null ? null : shift.getId())
                .shiftCode(shift == null ? null : shift.getCode())
                .shiftName(shift == null ? null : shift.getDisplayName())
                .startTime(shift == null ? null : shift.getStartTime())
                .endTime(shift == null ? null : shift.getEndTime())
                .overnight(shift != null && shift.isOvernight())
                .assignedById(assignment.getAssignedBy().getId())
                .assignedByName(assignment.getAssignedBy().getFullName())
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .updatedById(assignment.getUpdatedBy() == null ? null : assignment.getUpdatedBy().getId())
                .updatedByName(assignment.getUpdatedBy() == null ? null : assignment.getUpdatedBy().getFullName())
                .build();
    }
}
