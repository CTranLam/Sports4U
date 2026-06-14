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

export interface ProductPurchaseStatDTO {
  productId: number;
  productName: string;
  totalQuantitySold?: number;
  quantitySold?: number;
  totalQuantity?: number;
  quantity?: number;
  count?: number;
}

export interface ProductPurchaseStatsListDTO {
  stats: ProductPurchaseStatDTO[];
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
