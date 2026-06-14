import { Link } from 'react-router-dom';
import { CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatters';

interface DeliverySummaryCardProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'COD' | 'VNPAY';
  setPaymentMethod: (method: 'COD' | 'VNPAY') => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function DeliverySummaryCard({
  subtotal,
  shippingFee,
  total,
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  isSubmitting,
}: DeliverySummaryCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-4">Tóm tắt đơn hàng</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-500 font-medium">
          <span>Tạm tính</span>
          <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-500 font-medium">
          <span>Phí vận chuyển</span>
          <span className="font-bold text-slate-800">
            {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
          </span>
        </div>
        
        <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline mb-6">
          <span className="font-bold text-slate-900">Tổng cộng</span>
          <span className="text-xl font-black text-slate-950">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5 space-y-4 mb-6">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <CreditCard size={16} className="text-slate-500" />
          Phương thức thanh toán
        </h3>

        <div className="space-y-3">
          {/* COD */}
          <label
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'COD'
                ? 'border-slate-950 bg-slate-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')}
              className="h-4.5 w-4.5 text-slate-950 focus:ring-slate-950 accent-slate-950"
            />
            <div className="text-xs">
              <p className="font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</p>
              <p className="text-slate-450 mt-0.5">Giao hàng và thu tiền tại nhà</p>
            </div>
          </label>

          {/* VNPAY */}
          <label
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'VNPAY'
                ? 'border-slate-950 bg-slate-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="VNPAY"
              checked={paymentMethod === 'VNPAY'}
              onChange={() => setPaymentMethod('VNPAY')}
              className="h-4.5 w-4.5 text-slate-950 focus:ring-slate-950 accent-slate-950"
            />
            <div className="text-xs">
              <p className="font-bold text-slate-800">Thanh toán điện tử VNPay</p>
              <p className="text-slate-450 mt-0.5">Thanh toán online qua thẻ ATM/QR Code</p>
            </div>
          </label>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-slate-950 hover:bg-slate-900 text-white py-6 rounded-xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Đang xử lý đơn hàng...
          </>
        ) : (
          'Xác nhận đặt hàng'
        )}
      </Button>

      <Link to="/cart">
        <Button variant="outline" className="w-full border-slate-200 text-slate-700 py-5 rounded-xl font-bold text-sm mt-3 flex items-center justify-center gap-1.5">
          <ArrowLeft size={16} />
          Quay lại giỏ hàng
        </Button>
      </Link>
    </div>
  );
}
