package com.cupflow.CupFlow_ERP.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateEmployeeRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name must be 255 characters or fewer")
    private String fullName;

    @NotBlank(message = "Job title is required")
    @Size(max = 255, message = "Job title must be 255 characters or fewer")
    private String jobTitle;

    @NotBlank(message = "Department is required")
    @Size(max = 255, message = "Department must be 255 characters or fewer")
    private String department;

    private LocalDate dateOfJoining;

    @Size(max = 20, message = "Phone number must be 20 characters or fewer")
    private String contactPhone;

    @Email(message = "Contact email must be valid")
    @Size(max = 255, message = "Contact email must be 255 characters or fewer")
    private String contactEmail;
}
