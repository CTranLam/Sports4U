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

export interface OrderPreviewResponseDTO {
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  fullName: string;
  phone: string;
  fullAddress: string;
}

export interface OrderResponseDTO {
  orderId: number;
  totalAmount: number;
}

export interface BuyNowPayload {
  productId: number;
  quantity: number;
  paymentMethod?: string;
}

export interface CreateOrderPayload {
  cartItemIds: number[];
  paymentMethod: string;
}
