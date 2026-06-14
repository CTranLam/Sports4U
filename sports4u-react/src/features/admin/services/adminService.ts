import apiClient from '@/services/apiClient';
import type { ResponseDTO, PageResponse } from '@/types/common';
import type { CategoryDTO } from '@/features/products/types';
import type {
  UserAdminDTO,
  DashboardSummaryDTO,
  DashboardRevenueListDTO,
  DashboardCategoryStatListDTO,
  DashboardOrderStatListDTO,
  ProductPurchaseStatsListDTO,
  ProductAdminDTO,
  OrderResponseInAdminDTO,
} from '../types';

export const adminService = {
  // Dashboard
  getDashboardSummary: async (): Promise<ResponseDTO<DashboardSummaryDTO>> => {
    return await apiClient.get('/admin/dashboard/summary');
  },

  getRevenueByMonth: async (year: number): Promise<ResponseDTO<DashboardRevenueListDTO>> => {
    return await apiClient.get(`/admin/dashboard/revenue-by-month?year=${year}`);
  },

  getProductByCategory: async (): Promise<ResponseDTO<DashboardCategoryStatListDTO>> => {
    return await apiClient.get('/admin/dashboard/product-by-category');
  },

  getOrdersLast7Days: async (): Promise<ResponseDTO<DashboardOrderStatListDTO>> => {
    return await apiClient.get('/admin/dashboard/orders-last-7-days');
  },

  getProductPurchaseStats: async (): Promise<ResponseDTO<ProductPurchaseStatsListDTO>> => {
    return await apiClient.get('/admin/dashboard/product-purchase-stats');
  },

  // Accounts
  getAccounts: async (
    page: number,
    size: number,
    status?: string,
    role?: string
  ): Promise<ResponseDTO<PageResponse<UserAdminDTO>>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (status) params.append('status', status);
    if (role) params.append('role', role);
    return await apiClient.get(`/admin/accounts?${params.toString()}`);
  },

  createAccount: async (payload: { email: string; password?: string; retypePassword?: string; role: string; status: number }): Promise<ResponseDTO<UserAdminDTO>> => {
    return await apiClient.post('/admin/account', payload);
  },

  updateAccount: async (id: number, payload: { role: string; newPassword?: string }): Promise<ResponseDTO<UserAdminDTO>> => {
    return await apiClient.put(`/admin/account/${id}`, payload);
  },

  lockAccount: async (id: number): Promise<ResponseDTO<string>> => {
    return await apiClient.delete(`/admin/account/${id}`);
  },

  unlockAccount: async (id: number): Promise<ResponseDTO<string>> => {
    return await apiClient.put(`/admin/account/${id}/unlock`);
  },

  // Categories
  getCategories: async (page: number, size: number): Promise<ResponseDTO<PageResponse<CategoryDTO>>> => {
    return await apiClient.get(`/admin/categories?page=${page}&size=${size}`);
  },

  createCategory: async (payload: { categoryName: string; parentId?: number | null }): Promise<ResponseDTO<CategoryDTO>> => {
    return await apiClient.post('/admin/categories', payload);
  },

  updateCategory: async (id: number, payload: { categoryName: string; parentId?: number | null }): Promise<ResponseDTO<CategoryDTO>> => {
    return await apiClient.put(`/admin/categories/${id}`, payload);
  },

  deleteCategory: async (id: number): Promise<ResponseDTO<string>> => {
    return await apiClient.delete(`/admin/categories/${id}`);
  },

  // Products
  getProducts: async (
    page: number,
    size: number,
    filters: {
      keyword?: string;
      categoryId?: string;
      stockStatus?: string;
      isPopular?: string;
      minPrice?: string;
      maxPrice?: string;
    }
  ): Promise<ResponseDTO<PageResponse<ProductAdminDTO>>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.stockStatus) params.append('stockStatus', filters.stockStatus);
    if (filters.isPopular) params.append('isPopular', filters.isPopular);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    return await apiClient.get(`/admin/products?${params.toString()}`);
  },

  createProduct: async (formData: FormData): Promise<ResponseDTO<ProductAdminDTO>> => {
    return await apiClient.post('/admin/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProduct: async (id: number, formData: FormData): Promise<ResponseDTO<ProductAdminDTO>> => {
    return await apiClient.put(`/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteProduct: async (id: number): Promise<ResponseDTO<string>> => {
    return await apiClient.delete(`/admin/products/${id}`);
  },

  // Orders
  getOrders: async (
    page: number,
    size: number,
    status?: string,
    paymentStatus?: string
  ): Promise<ResponseDTO<PageResponse<OrderResponseInAdminDTO>>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (status) params.append('status', status);
    if (paymentStatus) params.append('paymentStatus', paymentStatus);
    return await apiClient.get(`/admin/orders?${params.toString()}`);
  },

  updateOrderStatus: async (id: number, status: string): Promise<ResponseDTO<string>> => {
    return await apiClient.put(`/admin/orders/${id}/status`, null, {
      params: { status },
    });
  },
};
