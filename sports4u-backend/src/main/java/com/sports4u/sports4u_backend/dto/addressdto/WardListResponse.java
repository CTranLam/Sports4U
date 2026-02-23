package com.sports4u.sports4u_backend.dto.addressdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WardListResponse {
    private List<WardResponseDTO> wards;
}

