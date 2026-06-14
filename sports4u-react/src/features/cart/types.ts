export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

export interface CartItemResponseDTO {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selected: boolean;
}

export interface UpdateCartItemPayload {
  productId?: number;
  quantity?: number;
  selected?: boolean;
}
