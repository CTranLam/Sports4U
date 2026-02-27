package com.sports4u.sports4u_backend.converter;

import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductDTO;
import com.sports4u.sports4u_backend.entity.ProductEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductEntityToDTO {
    public static ProductDTO convertToProductDTO(ProductEntity product) {
        if (product == null) return null;

        return ProductDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategoryEntity().getCategoryId())
                .categoryName(product.getCategoryEntity().getCategoryName())
                .origin(product.getOrigin())
                .advantages(product.getAdvantages())
                .quantity(product.getStockQuantity())
                .inStock(product.getStockQuantity() > 0)
                .build();
    }

    public static ProductAdminDTO convertProductAdminDTO(ProductEntity product) {
        if (product == null) return null;

        return ProductAdminDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .description(product.getDescription())
                .categoryId(product.getCategoryEntity().getCategoryId())
                .categoryName(product.getCategoryEntity().getCategoryName())
                .origin(product.getOrigin())
                .advantages(product.getAdvantages())
                .quantity(product.getStockQuantity())
                .inStock(product.getStockQuantity() > 0)
                .build();
    }


}
