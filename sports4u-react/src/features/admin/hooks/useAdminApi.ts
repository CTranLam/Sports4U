import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

// Dashboard
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'summary'],
    queryFn: async () => {
      const response = await adminService.getDashboardSummary();
      return response.data;
    },
  });
};

export const useRevenueByMonth = (year: number) => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'revenue', year],
    queryFn: async () => {
      const response = await adminService.getRevenueByMonth(year);
      return response.data;
    },
  });
};

export const useProductByCategory = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'product-by-category'],
    queryFn: async () => {
      const response = await adminService.getProductByCategory();
      return response.data;
    },
  });
};

export const useOrdersLast7Days = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'orders-last-7-days'],
    queryFn: async () => {
      const response = await adminService.getOrdersLast7Days();
      return response.data;
    },
  });
};

export const useProductPurchaseStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'product-purchase-stats'],
    queryFn: async () => {
      const response = await adminService.getProductPurchaseStats();
      return response.data?.stats ?? [];
    },
  });
};

// Accounts
export const useAccounts = (page: number, size: number, status?: string, role?: string) => {
  return useQuery({
    queryKey: ['admin', 'accounts', page, size, status, role],
    queryFn: async () => {
      const response = await adminService.getAccounts(page, size, status, role);
      return response.data;
    },
  });
};

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'summary'] });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { role: string; newPassword?: string } }) => adminService.updateAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });
    },
  });
};

export const useLockAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.lockAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });
    },
  });
};

export const useUnlockAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.unlockAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });
    },
  });
};

// Categories
export const useAdminCategories = (page: number, size: number) => {
  return useQuery({
    queryKey: ['admin', 'categories', page, size],
    queryFn: async () => {
      const response = await adminService.getCategories(page, size);
      return response.data;
    },
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { categoryName: string; parentId?: number | null } }) =>
      adminService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Products
export const useAdminProducts = (
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
) => {
  return useQuery({
    queryKey: ['admin', 'products', page, size, filters],
    queryFn: async () => {
      const response = await adminService.getProducts(page, size, filters);
      return response.data;
    },
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => adminService.updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Orders
export const useAdminOrders = (page: number, size: number, status?: string, paymentStatus?: string) => {
  return useQuery({
    queryKey: ['admin', 'orders', page, size, status, paymentStatus],
    queryFn: async () => {
      const response = await adminService.getOrders(page, size, status, paymentStatus);
      return response.data;
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) => adminService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'summary'] });
    },
  });
};
