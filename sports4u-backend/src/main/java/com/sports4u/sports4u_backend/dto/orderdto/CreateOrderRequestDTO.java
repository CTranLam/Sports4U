package com.sports4u.sports4u_backend.dto.orderdto;

import com.sports4u.sports4u_backend.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateOrderRequestDTO {
    private List<Long> cartItemIds;
    private PaymentMethod paymentMethod;
}
