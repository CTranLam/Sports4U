package com.sports4u.sports4u_backend.dto.userdto;

import com.sports4u.sports4u_backend.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInAdminDTO {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Retype password is required")
    private String retypePassword;

    private Role role;

    private Long status;
}
