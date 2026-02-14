package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductRequestDTO;
import com.sports4u.sports4u_backend.utils.PageResponse;
import org.springframework.web.multipart.MultipartFile;

public interface IProductService {
    PageResponse<ProductDTO> getProductsByCategory(Long id, int page, int size) throws IllegalArgumentException;
    PageResponse<ProductAdminDTO> getProductsByCategoryForAdmin(Long id, int page, int size) throws IllegalArgumentException;
    ProductAdminDTO createProduct(ProductRequestDTO productRequestDTO,
                                  MultipartFile imageFile) throws IllegalArgumentException;
    ProductAdminDTO updateProduct(Long id, ProductRequestDTO data, MultipartFile imageFile);
    void deleteProduct(Long productId) throws IllegalArgumentException;
    ProductDTO getProductById(Long id) throws IllegalArgumentException;
}
