package com.sports4u.sports4u_backend.dto.orderdto;

import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long orderId;
    private BigDecimal totalAmount;
}

