package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductRequestDTO;
import com.sports4u.sports4u_backend.utils.PageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public interface IProductService {
    PageResponse<ProductDTO> getProductsByCategory(Long id, int page, int size) throws IllegalArgumentException;
    PageResponse<ProductAdminDTO> getProductsByCategoryForAdmin(Long id, int page, int size) throws IllegalArgumentException;
    PageResponse<ProductAdminDTO> getAllProductsForAdmin(String keyword, Long categoryId, String stockStatus,
                                                        Boolean isPopular, BigDecimal minPrice, BigDecimal maxPrice,
                                                        int page, int size);
    ProductAdminDTO createProduct(ProductRequestDTO productRequestDTO,
                                  MultipartFile imageFile) throws IllegalArgumentException;
    ProductAdminDTO updateProduct(Long id, ProductRequestDTO data, MultipartFile imageFile);
    void deleteProduct(Long productId) throws IllegalArgumentException;
    ProductDTO getProductById(Long id) throws IllegalArgumentException;
    PageResponse<ProductDTO> searchProducts(String keyword, int page, int size);
    PageResponse<ProductDTO> getProductsPopularByCategory(Long categoryId, int page, int size) throws IllegalArgumentException;
}
