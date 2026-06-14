import { X, Loader2, User, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/utils/formatters';
import { STATUS_CONFIG } from './statusConfig';
import type { OrderDetailDTO } from '../types';

interface OrderDetailModalProps {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
  orderDetail: OrderDetailDTO | null | undefined;
  isLoadingDetail: boolean;
  onCancelOrder: (id: number) => void;
  isCancelling: boolean;
}

export function OrderDetailModal({
  orderId,
  isOpen,
  onClose,
  orderDetail,
  isLoadingDetail,
  onCancelOrder,
  isCancelling,
}: OrderDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Chi tiết đơn hàng #{orderId}</h3>
            {orderDetail && (
              <p className="text-xs text-slate-400 font-medium mt-0.5">Đặt ngày {formatDate(orderDetail.orderDate)}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoadingDetail ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="animate-spin text-slate-900" size={32} />
              <span className="font-semibold text-sm">Đang tải chi tiết đơn hàng...</span>
            </div>
          ) : !orderDetail ? (
            <div className="py-12 text-center text-red-600">
              Không tìm thấy chi tiết đơn hàng hoặc đã xảy ra lỗi.
            </div>
          ) : (
            <>
              {/* Status Badge Block */}
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Trạng thái đơn hàng</span>
                {(() => {
                  const cfg = STATUS_CONFIG[orderDetail.status] || {
                    label: orderDetail.status,
                    bg: 'bg-slate-50 border-slate-100',
                    text: 'text-slate-700',
                    icon: Clock,
                  };
                  const Icon = cfg.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-extrabold border ${cfg.bg} ${cfg.text}`}>
                      <Icon size={14} />
                      {cfg.label}
                    </span>
                  );
                })()}
              </div>

              {/* Shipping Address info */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Thông tin giao nhận</h4>
                <div className="border border-slate-100 rounded-2xl p-5 space-y-3.5 bg-white shadow-sm">
                  <div className="flex items-center gap-3 text-sm">
                    <User size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-500">Người nhận:</span>
                    <strong className="text-slate-800 font-bold ml-auto">{orderDetail.receiverName}</strong>
                  </div>
                  <div className="flex items-center gap-3 text-sm border-t border-slate-50 pt-3">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-500">Số điện thoại:</span>
                    <strong className="text-slate-800 font-bold ml-auto">{orderDetail.receiverPhone}</strong>
                  </div>
                  <div className="flex gap-3 text-sm border-t border-slate-50 pt-3">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-500 shrink-0">Địa chỉ nhận:</span>
                    <span className="text-slate-700 font-bold text-right ml-auto leading-relaxed max-w-[70%]">{orderDetail.fullAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Sản phẩm đã mua</h4>
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="divide-y divide-slate-150">
                    {orderDetail.items.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                        {/* Product Image */}
                        <div className="h-16 w-16 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={item.thumbnail || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200'}
                            alt={item.productName}
                            className="h-full w-full object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-slate-800 truncate mb-1" title={item.productName}>
                            {item.productName}
                          </h5>
                          <p className="text-xs text-slate-400 font-semibold">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-slate-900">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Chi tiết thanh toán</h4>
                <div className="border border-slate-100 rounded-2xl p-5 space-y-3 bg-white shadow-sm">
                  <div className="flex justify-between text-sm text-slate-500 font-semibold">
                    <span>Tổng tiền sản phẩm</span>
                    <span className="text-slate-800">{formatPrice(orderDetail.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 font-semibold">
                    <span>Phí vận chuyển</span>
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-100 pt-3 mt-1">
                    <span>Tổng thanh toán</span>
                    <span className="text-lg font-black text-slate-900">{formatPrice(orderDetail.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4.5 border-t border-slate-150 flex items-center justify-end bg-slate-50/50 gap-3">
          {orderDetail?.status === 'PENDING' && (
            <Button
              variant="outline"
              onClick={() => {
                onCancelOrder(orderId);
                onClose();
              }}
              disabled={isCancelling}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl h-11 font-bold text-sm"
            >
              Hủy đơn hàng
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-slate-950 hover:bg-slate-900 text-white rounded-xl h-11 font-bold text-sm px-6 shadow-sm"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
