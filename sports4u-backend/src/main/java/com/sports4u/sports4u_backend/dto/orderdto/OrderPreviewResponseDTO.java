package com.sports4u.sports4u_backend.dto.orderdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderPreviewResponseDTO {
    private Long productId;
    private String productName;
    private String imageUrl;
    private Long quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private String fullName;
    private String phone;
    private String fullAddress;
}
