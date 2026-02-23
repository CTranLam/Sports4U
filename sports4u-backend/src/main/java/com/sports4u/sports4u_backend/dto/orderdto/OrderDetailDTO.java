package com.sports4u.sports4u_backend.dto.orderdto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDTO {
    private Long orderId;
    private String status;
    private LocalDateTime orderDate;
    private String fullAddress;
    private BigDecimal totalAmount;
    private List<OrderItemDetailDTO> items;
}
