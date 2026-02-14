package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductDTO;
import com.sports4u.sports4u_backend.entity.ProductEntity;
import com.sports4u.sports4u_backend.repository.ProductRepository;
import com.sports4u.sports4u_backend.service.IProductService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final RestClient.Builder builder;

    @Override
    public PageResponse<ProductDTO> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by("productId").descending()
        );

        Page<ProductEntity> productPage =
                productRepository.findByCategoryEntity_CategoryIdAndIsDeletedFalse(
                        categoryId, pageable
                );

        List<ProductDTO> products = productPage.getContent()
                .stream()
                .map(product -> ProductDTO.builder()
                        .productId(product.getProductId())
                        .productName(product.getProductName())
                        .price(product.getPrice())
                        .imageUrl(product.getImageUrl())
                        .build())
                .toList();

        return PageResponse.<ProductDTO>builder()
                .content(products)
                .pageNumber(productPage.getNumber() + 1)
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Override
    public PageResponse<ProductAdminDTO> getProductsByCategoryForAdmin(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by("productId").descending()
        );

        Page<ProductEntity> productPage =
                productRepository.findByCategoryEntity_CategoryIdAndIsDeletedFalse(
                        categoryId, pageable
                );

        List<ProductAdminDTO> products = productPage.getContent()
                .stream()
                .map(product -> ProductAdminDTO.builder()
                        .productId(product.getProductId())
                        .productName(product.getProductName())
                        .price(product.getPrice())
                        .imageUrl(product.getImageUrl())
                        .categoryId(product.getCategoryEntity().getCategoryId())
                        .categoryName(product.getCategoryEntity().getCategoryName())
                        .origin(product.getOrigin())
                        .advantages(product.getAdvantages())
                        .inStock(product.getStockQuantity() > 0)
                        .quantity(product.getStockQuantity())
                        .build())
                .toList();

        return PageResponse.<ProductAdminDTO>builder()
                .content(products)
                .pageNumber(productPage.getNumber() + 1)
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();

    }
}
