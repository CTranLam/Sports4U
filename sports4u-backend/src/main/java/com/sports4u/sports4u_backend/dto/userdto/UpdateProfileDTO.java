package com.sports4u.sports4u_backend.dto.userdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileDTO {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Province is required")
    private String provinceCode;

    @NotBlank(message = "Ward is required")
    private String wardCode;

    @NotBlank(message = "Address detail is required")
    @Size(max = 255)
    private String detailAddress;

    private String password;
}
