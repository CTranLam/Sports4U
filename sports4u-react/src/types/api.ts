export interface ResponseDTO<T> {
  message: string;
  data: T | null;
}

export interface LoginResponseData {
  token: string;
  email: string;
  id: number;
  role: string;
}

export interface UserResponseDTO {
  userId: number;
  userName: string;
  fullName?: string;
  phone?: string;
  role: string;
  provider?: string;
}

export interface CategoryDTO {
  categoryId: number;
  categoryName: string;
  productCount: number;
  parentId: number | null;
}

export interface CategoryListResponse {
  categories: CategoryDTO[];
}

export interface ProductDTO {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
  categoryId: number;
  categoryName: string;
  origin: string;
  advantages: string;
  quantity: number;
  inStock: boolean;
  isPopular: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
