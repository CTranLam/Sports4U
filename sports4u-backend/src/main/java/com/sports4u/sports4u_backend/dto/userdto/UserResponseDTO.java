package com.sports4u.sports4u_backend.dto.userdto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long userId;
    private String userName;
    private String fullName;
    private String phone;
    private String role;
    private Long status;
    private String provinceName;
    private String provinceCode;
    private String wardName;
    private String wardCode;
    private String detailAddress;
}
