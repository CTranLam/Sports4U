package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductDTO;
import com.sports4u.sports4u_backend.utils.PageResponse;

public interface IProductService {
    PageResponse<ProductDTO> getProductsByCategory(Long id, int page, int size);
    PageResponse<ProductAdminDTO> getProductsByCategoryForAdmin(Long id, int page, int size);
}
