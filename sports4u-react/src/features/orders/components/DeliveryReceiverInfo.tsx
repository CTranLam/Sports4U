import { User, MapPin } from 'lucide-react';

interface DeliveryReceiverInfoProps {
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
}

export function DeliveryReceiverInfo({ receiverName, receiverPhone, deliveryAddress }: DeliveryReceiverInfoProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <User size={18} className="text-slate-500" />
        Thông tin người nhận
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Họ và tên</span>
          <p className="text-sm font-bold text-slate-800">{receiverName}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Số điện thoại</span>
          <p className="text-sm font-bold text-slate-800">{receiverPhone}</p>
        </div>
        <div className="space-y-1 md:col-span-2 pt-2 border-t border-slate-50">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Địa chỉ giao hàng</span>
          <p className="text-sm font-bold text-slate-800 flex items-start gap-1.5 mt-0.5">
            <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <span>{deliveryAddress}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
