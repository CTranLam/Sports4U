import { Button } from '../../components/ui/button';
import { Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';
import type { ProductDTO } from '../../types/api';

interface ProductActionsProps {
  product: ProductDTO;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAddingToCart: boolean;
}

export default function ProductActions({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  isAddingToCart,
}: ProductActionsProps) {
  const maxStock = product.inStock ? product.quantity : 0;

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < Math.min(10, maxStock)) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-100">
      {/* Quantity Selection */}
      {product.inStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-500">Số lượng:</span>
          <div className="flex items-center rounded-lg border border-slate-200 p-1 bg-slate-50/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-100"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </Button>
            <span className="w-10 text-center font-bold text-slate-800 text-sm">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-100"
              onClick={handleIncrease}
              disabled={quantity >= Math.min(10, maxStock)}
            >
              <Plus size={14} />
            </Button>
          </div>
          <span className="text-xs text-slate-400">
            ({maxStock} sản phẩm có sẵn)
          </span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          size="lg"
          variant="outline"
          disabled={!product.inStock || isAddingToCart}
          onClick={onAddToCart}
          className="flex-1 border-slate-900 text-slate-900 hover:bg-slate-50 h-12 font-bold text-sm tracking-wide"
        >
          <ShoppingCart size={16} className="mr-2" />
          {isAddingToCart ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
        </Button>

        <Button
          size="lg"
          disabled={!product.inStock}
          onClick={onBuyNow}
          className="flex-1 bg-slate-950 text-white hover:bg-slate-850 h-12 font-bold text-sm tracking-wide"
        >
          <CreditCard size={16} className="mr-2" />
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
