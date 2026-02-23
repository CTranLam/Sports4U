package com.sports4u.sports4u_backend.dto.addressdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProvinceResponseDTO {

    private String code;
    private String name;
}
