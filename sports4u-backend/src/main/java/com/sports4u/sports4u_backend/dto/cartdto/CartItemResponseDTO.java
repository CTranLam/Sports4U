package com.sports4u.sports4u_backend.dto.cartdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemResponseDTO {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private String imageUrl;
    private Long quantity;
    private Boolean selected;
}
