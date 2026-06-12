import apiClient from './apiClient';
import type { ResponseDTO, CategoryListResponse, CategoryDTO, ProductDTO, PageResponse } from '../types/api';

export const productService = {
  // Lấy danh mục cha cho trang chủ
  getParentsCategories: async (): Promise<ResponseDTO<CategoryListResponse>> => {
    return await apiClient.get('/categories/parents');
  },

  // Lấy danh mục con
  getCategoryChild: async (categoryId: number): Promise<ResponseDTO<CategoryDTO[]>> => {
    return await apiClient.get(`/categories/${categoryId}/child`);
  },

  // Lấy sản phẩm theo danh mục (có phân trang)
  getProductsByCategoryId: async (
    categoryId: number,
    page = 1,
    size = 12,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      sortBy?: string;
    }
  ): Promise<ResponseDTO<PageResponse<ProductDTO>>> => {
    return await apiClient.get(`/categories/${categoryId}/products`, {
      params: { 
        page, 
        size,
        minPrice: filters?.minPrice,
        maxPrice: filters?.maxPrice,
        inStock: filters?.inStock,
        sortBy: filters?.sortBy,
      },
    });
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (productId: number): Promise<ResponseDTO<ProductDTO>> => {
    return await apiClient.get(`/products/${productId}`);
  },

  // Lấy danh sách sản phẩm phổ biến theo danh mục (có phân trang)
  getPopularProducts: async (
    categoryId: number,
    page = 1,
    size = 12
  ): Promise<ResponseDTO<PageResponse<ProductDTO>>> => {
    return await apiClient.get(`/products/popular/${categoryId}`, {
      params: { page, size },
    });
  },

  // Tìm kiếm sản phẩm (có phân trang)
  searchProducts: async (
    keyword: string,
    page = 1,
    size = 12,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      sortBy?: string;
    }
  ): Promise<ResponseDTO<PageResponse<ProductDTO>>> => {
    return await apiClient.get('/products/search', {
      params: { 
        keyword, 
        page, 
        size,
        minPrice: filters?.minPrice,
        maxPrice: filters?.maxPrice,
        inStock: filters?.inStock,
        sortBy: filters?.sortBy,
      },
    });
  },
};
