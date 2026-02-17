package com.sports4u.sports4u_backend.converter;

import com.sports4u.sports4u_backend.dto.cartdto.CartItemDTO;
import com.sports4u.sports4u_backend.entity.CartItemEntity;
import com.sports4u.sports4u_backend.entity.ProductEntity;
import com.sports4u.sports4u_backend.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ConvertCartItem {
    public static CartItemEntity convertToCartItemEntity(CartItemDTO cartItemDTO, UserEntity userEntity, ProductEntity productEntity) {
        if (cartItemDTO == null) return null;

        return CartItemEntity.builder()
                .user(userEntity)
                .product(productEntity)
                .quantity(cartItemDTO.getQuantity())
                .priceAtAdded(productEntity.getPrice())
                .selected(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

    }
}
