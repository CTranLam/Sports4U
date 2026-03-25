package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.converter.ProductEntityToDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductAdminDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductDTO;
import com.sports4u.sports4u_backend.dto.productdto.ProductRequestDTO;
import com.sports4u.sports4u_backend.entity.CategoryEntity;
import com.sports4u.sports4u_backend.entity.ProductEntity;
import com.sports4u.sports4u_backend.repository.CategoryRepository;
import com.sports4u.sports4u_backend.repository.ProductRepository;
import com.sports4u.sports4u_backend.service.ICloudinaryService;
import com.sports4u.sports4u_backend.service.IProductService;
import com.sports4u.sports4u_backend.utils.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final ICloudinaryService cloudinaryService;


    @Override
    @Cacheable(value = "productList", key = "#categoryId + '-' + #page + '-' + #size")
    public PageResponse<ProductDTO> getProductsByCategory(Long categoryId, int page, int size) {
        System.out.println("Fetching products from database for category: " + categoryId + ", page: " + page);
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
                .map(ProductEntityToDTO::convertToProductDTO)
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
    @Cacheable(value = "productList", key = "'admin-' + #categoryId + '-' + #page + '-' + #size")
    public PageResponse<ProductAdminDTO> getProductsByCategoryForAdmin(Long categoryId, int page, int size) {
        System.out.println("Fetching products from database for admin - category: " + categoryId + ", page: " + page);
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
                .map(ProductEntityToDTO::convertProductAdminDTO)
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

    @Override
    public PageResponse<ProductAdminDTO> getAllProductsForAdmin(String keyword, Long categoryId, String stockStatus,
                                                               BigDecimal minPrice, BigDecimal maxPrice,
                                                               int page, int size) {
        // NOTE: Do NOT pass Sort to Pageable when using a native query —
        // Spring Data JPA cannot inject Sort into native SQL and will throw an exception.
        // ORDER BY is already hardcoded in the query.
        Pageable pageable = PageRequest.of(page - 1, size);

        // Convert stockStatus string to Boolean
        Boolean inStock = null;
        if ("IN_STOCK".equalsIgnoreCase(stockStatus)) {
            inStock = true;
        } else if ("OUT_OF_STOCK".equalsIgnoreCase(stockStatus)) {
            inStock = false;
        }

        // Treat blank keyword as null
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;

        Page<ProductEntity> productPage = productRepository.findAllWithFilters(
                kw, categoryId, inStock, minPrice, maxPrice, pageable
        );

        List<ProductAdminDTO> products = productPage.getContent()
                .stream()
                .map(ProductEntityToDTO::convertProductAdminDTO)
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

    @Override
    @CacheEvict(value = {"productDetail", "productList"}, allEntries = true)
    public ProductAdminDTO createProduct(ProductRequestDTO data, MultipartFile imageFile) {
        System.out.println("Creating new product and clearing cache");
        boolean exists = productRepository
                .existsByProductNameIgnoreCaseAndCategoryEntity_CategoryIdAndIsDeletedFalse(
                        data.getProductName(), data.getCategoryId()
                );

        if (exists) {
            throw new IllegalArgumentException("Sản phẩm đã tồn tại trong danh mục");
        }
        if (data == null) {
            throw new IllegalArgumentException("Dữ liệu sản phẩm không được để trống");
        }
        if (data.getProductName() == null || data.getProductName().isBlank()) {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống");
        }
        if (data.getPrice() == null || data.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Giá sản phẩm phải lớn hơn 0");
        }
        if (data.getCategoryId() == null || data.getCategoryId() <= 0) {
            throw new IllegalArgumentException("Danh mục không hợp lệ");
        }
        if (data.getStockQuantity() == null || data.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Số lượng tồn kho không được âm");
        }
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Ảnh sản phẩm không được để trống");
        }

        CategoryEntity category = categoryRepository.findById(data.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại"));

        String imageUrl = cloudinaryService.upload(imageFile);

        ProductEntity product = ProductEntity.builder()
                .productName(data.getProductName())
                .price(data.getPrice())
                .categoryEntity(category)
                .origin(data.getOrigin())
                .advantages(data.getAdvantages())
                .stockQuantity(data.getStockQuantity())
                .imageUrl(imageUrl)
                .isDeleted(false)
                .build();

        productRepository.save(product);

        return ProductEntityToDTO.convertProductAdminDTO(product);
    }

    @Override
    @CacheEvict(value = {"productDetail", "productList"}, allEntries = true)
    public ProductAdminDTO updateProduct(Long id, ProductRequestDTO data, MultipartFile imageFile) {
        System.out.println("Updating product and clearing cache: " + id);

        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

        CategoryEntity category = categoryRepository.findById(data.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại"));

        product.setProductName(data.getProductName());
        product.setPrice(data.getPrice());
        product.setCategoryEntity(category);
        product.setOrigin(data.getOrigin());
        product.setAdvantages(data.getAdvantages());
        product.setStockQuantity(data.getStockQuantity());

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.upload(imageFile);
            product.setImageUrl(imageUrl);
        }
        productRepository.save(product);
        return ProductEntityToDTO.convertProductAdminDTO(product);
    }


    @Override
    @CacheEvict(value = {"productDetail", "productList", "dashboardSummary", "productByCategory"}, allEntries = true)
    public void deleteProduct(Long productId) throws IllegalArgumentException {
        System.out.println("Deleting product and clearing cache: " + productId);
        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

        productEntity.setIsDeleted(true);
        productRepository.save(productEntity);
    }

    @Override
    @Cacheable(value = "productDetail", key = "#id")
    public ProductDTO getProductById(Long id) throws IllegalArgumentException {
        System.out.println("Fetching product from database by ID: " + id);
        ProductEntity product = productRepository.findByProductIdAndIsDeletedFalse(id);
        if (product == null) {
            throw new IllegalArgumentException("Sản phẩm không tồn tại");
        }
        return ProductEntityToDTO.convertToProductDTO(product);
    }

    @Override
    public PageResponse<ProductDTO> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("productId").descending());
        Page<ProductEntity> productPage =
                productRepository.findByProductNameContainingIgnoreCaseAndIsDeletedFalse(keyword, pageable);

        List<ProductDTO> products = productPage.getContent()
                .stream()
                .map(ProductEntityToDTO::convertToProductDTO)
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

}
