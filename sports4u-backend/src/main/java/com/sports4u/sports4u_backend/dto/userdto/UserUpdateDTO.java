package com.sports4u.sports4u_backend.dto.userdto;

import com.sports4u.sports4u_backend.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDTO {
    private String newPassword;
    private Role role;
}
