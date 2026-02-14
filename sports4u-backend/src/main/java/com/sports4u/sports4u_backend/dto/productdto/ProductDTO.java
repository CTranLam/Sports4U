package com.sports4u.sports4u_backend.dto.productdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
    private Long productId;
    private String productName;
    private BigDecimal price;
    private String imageUrl;

    private Long categoryId;
    private String categoryName;

    private String origin;
    private String advantages;

    private Boolean inStock;
}
