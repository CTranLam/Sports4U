package com.sports4u.sports4u_backend.dto.orderdto;

import com.sports4u.sports4u_backend.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BuyNowRequestDTO {
    private Long productId;
    private Long quantity;
    private PaymentMethod paymentMethod;
}
