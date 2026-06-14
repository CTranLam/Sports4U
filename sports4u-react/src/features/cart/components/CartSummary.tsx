import { formatPrice } from '@/utils/formatters';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  selectedCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  onCheckout: () => void;
  disabled: boolean;
}

export function CartSummary({
  selectedCount,
  subtotal,
  shippingFee,
  total,
  onCheckout,
  disabled,
}: CartSummaryProps) {
  return (
    <div className="border border-slate-100 bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-slate-600 font-medium">
          <span>Tạm tính ({selectedCount} sản phẩm)</span>
          <span className="text-slate-900 font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600 font-medium">
          <span>Phí vận chuyển</span>
          <span className="text-slate-900 font-semibold">
            {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
          </span>
        </div>
        {shippingFee > 0 && (
          <p className="text-xs text-green-600 font-semibold mt-1">
            💡 Mua thêm {formatPrice(1000000 - subtotal)} để được miễn phí vận chuyển!
          </p>
        )}
      </div>

      <div className="border-t pt-4 mb-8 flex justify-between items-baseline">
        <span className="text-lg font-bold text-slate-950">Tổng thanh toán</span>
        <span className="text-2xl font-black text-slate-900">
          {formatPrice(total)}
        </span>
      </div>

      <Button
        onClick={onCheckout}
        disabled={disabled}
        className="w-full bg-slate-950 hover:bg-slate-900 text-white py-6 rounded-xl font-bold text-base shadow-lg transition-all disabled:opacity-50"
      >
        Thanh toán ngay ({selectedCount})
      </Button>
    </div>
  );
}
