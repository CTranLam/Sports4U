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

export interface OrderSummaryDTO {
  orderId: number;
  status: string;
  totalAmount: number;
  orderDate: string;
}

export interface OrderItemDetailDTO {
  productId: number;
  productName: string;
  thumbnail: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDetailDTO {
  orderId: number;
  status: string;
  orderDate: string;
  receiverName: string;
  receiverPhone: string;
  fullAddress: string;
  totalAmount: number;
  items: OrderItemDetailDTO[];
}

export interface ReviewDTO {
  reviewId: number;
  productId: number;
  fullName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequestDTO {
  productId: number;
  rating: number;
  comment: string;
}

export interface ProductRatingSummaryDTO {
  averageRating: number;
  totalReviews: number;
}

export interface UserAdminDTO {
  userId: number;
  userName: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  status: number;
}

export interface DashboardSummaryDTO {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
}

export interface MonthlyRevenueDTO {
  month: number;
  revenue: number;
}

export interface DashboardRevenueListDTO {
  revenues: MonthlyRevenueDTO[];
}

export interface CategoryStatDTO {
  category: string;
  count: number;
}

export interface DashboardCategoryStatListDTO {
  stats: CategoryStatDTO[];
}

export interface OrderStatDTO {
  date: string;
  count: number;
}

export interface DashboardOrderStatListDTO {
  orders: OrderStatDTO[];
}

export interface ProductPurchaseStatsListDTO {
  stats: ProductPurchaseStatDTO[];
}

export interface ProductPurchaseStatDTO {
  productId: number;
  productName: string;
  totalQuantitySold?: number;
  quantitySold?: number;
  totalQuantity?: number;
  quantity?: number;
  count?: number;
}

export interface ProductAdminDTO {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  description: string | null;
  categoryId: number;
  categoryName: string;
  origin: string | null;
  advantages: string | null;
  quantity: number;
  inStock: boolean;
  isPopular: boolean;
}

export interface OrderResponseInAdminDTO {
  orderId: number;
  userEmail: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderDate: string;
  fullAddress: string;
}




