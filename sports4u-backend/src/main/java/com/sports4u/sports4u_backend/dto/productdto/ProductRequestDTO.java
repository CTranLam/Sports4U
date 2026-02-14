package com.sports4u.sports4u_backend.dto.productdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequestDTO {
    private String productName;
    private BigDecimal price;
    private String imageUrl;
    private String description;

    private Long categoryId;

    private String origin;
    private String advantages;
    private Long stockQuantity;
}

