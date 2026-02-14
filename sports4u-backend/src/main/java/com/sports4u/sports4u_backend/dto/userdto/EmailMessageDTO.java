package com.sports4u.sports4u_backend.dto.userdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailMessageDTO{
    private Long otpId;
    private String to;
    private String subject;
    private String content;
}
