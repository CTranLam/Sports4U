import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/utils/formatters';
import type { OrderSummaryDTO } from '../types';

import { STATUS_CONFIG } from './statusConfig';

interface OrderCardProps {
  order: OrderSummaryDTO;
  onCancel: (id: number) => void;
  onViewDetail: (id: number) => void;
  isCancelling: boolean;
}

export function OrderCard({ order, onCancel, onViewDetail, isCancelling }: OrderCardProps) {
  const statusCfg = STATUS_CONFIG[order.status] || {
    label: order.status,
    bg: 'bg-slate-50 border-slate-100',
    text: 'text-slate-700',
    icon: Clock,
  };
  const StatusIcon = statusCfg.icon;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold text-slate-900">
            Đơn hàng #{order.orderId}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.text}`}>
            <StatusIcon size={12} />
            {statusCfg.label}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(order.orderDate)}
          </span>
          <span>•</span>
          <span>Tổng tiền: <strong className="text-slate-800 font-bold">{formatPrice(order.totalAmount)}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {order.status === 'PENDING' && (
          <Button
            variant="outline"
            onClick={() => onCancel(order.orderId)}
            disabled={isCancelling}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl h-10 font-bold text-sm"
          >
            Hủy đơn
          </Button>
        )}
        <Button
          onClick={() => onViewDetail(order.orderId)}
          className="bg-slate-950 hover:bg-slate-900 text-white rounded-xl h-10 font-bold text-sm px-5 shadow-sm"
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}
