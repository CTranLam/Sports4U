import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useParentCategories = () => {
  return useQuery({
    queryKey: ['categories', 'parents'],
    queryFn: () => productService.getParentsCategories(),
  });
};

export const useCategoryChild = (categoryId: number | undefined) => {
  return useQuery({
    queryKey: ['categories', categoryId, 'child'],
    queryFn: () => productService.getCategoryChild(categoryId!),
    enabled: typeof categoryId === 'number',
  });
};

export const useCategoryProducts = (
  categoryId: number | undefined,
  page = 1,
  size = 12,
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
  }
) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, page, size, filters],
    queryFn: () => productService.getProductsByCategoryId(categoryId!, page, size, filters),
    enabled: typeof categoryId === 'number',
  });
};

export const useProductDetail = (productId: number | undefined) => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => productService.getProductById(productId!),
    enabled: typeof productId === 'number',
  });
};

export const usePopularProducts = (
  categoryId: number,
  page = 1,
  size = 12
) => {
  return useQuery({
    queryKey: ['products', 'popular', categoryId, page, size],
    queryFn: () => productService.getPopularProducts(categoryId, page, size),
  });
};

export const useSearchProducts = (
  keyword: string,
  page = 1,
  size = 12,
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
  }
) => {
  return useQuery({
    queryKey: ['products', 'search', keyword, page, size, filters],
    queryFn: () => productService.searchProducts(keyword, page, size, filters),
    enabled: keyword.trim().length > 0,
  });
};
