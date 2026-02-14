package com.sports4u.sports4u_backend.dto.userdto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterResponseDTO {
    private String username;
    private String role;
}
