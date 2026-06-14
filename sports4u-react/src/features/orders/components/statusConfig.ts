import { Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

export const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  PENDING: { label: 'Chờ xử lý', bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', bg: 'bg-blue-50 border-blue-100', text: 'text-blue-700', icon: CheckCircle },
  SHIPPING: { label: 'Đang giao hàng', bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-700', icon: Truck },
  COMPLETED: { label: 'Đã hoàn thành', bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', bg: 'bg-rose-50 border-rose-100', text: 'text-rose-700', icon: XCircle },
};
