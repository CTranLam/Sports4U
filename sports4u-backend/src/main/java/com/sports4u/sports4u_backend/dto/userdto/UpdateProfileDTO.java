package com.sports4u.sports4u_backend.dto.userdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "Province is required")
    private Long provinceId;

    @NotNull(message = "Ward is required")
    private Long wardId;

    @NotBlank(message = "Address detail is required")
    @Size(max = 255)
    private String addressDetail;

    private String newPassword;
}
