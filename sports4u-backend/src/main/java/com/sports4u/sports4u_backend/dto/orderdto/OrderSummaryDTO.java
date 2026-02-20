package com.sports4u.sports4u_backend.dto.orderdto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderSummaryDTO {
    private Long orderId;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime orderDate;
}
