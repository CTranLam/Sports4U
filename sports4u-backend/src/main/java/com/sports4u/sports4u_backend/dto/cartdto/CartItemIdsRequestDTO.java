package com.sports4u.sports4u_backend.dto.cartdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemIdsRequestDTO {
    private List<Long> itemIds;
}
