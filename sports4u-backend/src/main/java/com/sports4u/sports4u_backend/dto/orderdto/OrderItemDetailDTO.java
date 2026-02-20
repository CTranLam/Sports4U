package com.sports4u.sports4u_backend.dto.orderdto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDetailDTO {
    private Long productId;
    private String productName;
    private String thumbnail;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}
