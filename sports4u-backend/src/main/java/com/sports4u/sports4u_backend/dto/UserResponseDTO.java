package com.sports4u.sports4u_backend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Integer userId;
    private String userName;
    private String fullName;
    private String phone;
    private String role;
    private Integer status;
}
