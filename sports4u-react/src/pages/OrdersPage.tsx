import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  useMyOrdersQuery,
  useOrderDetailQuery,
  useCancelOrderMutation,
} from '../hooks/useOrderApi';
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  User,
  Phone,
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  X,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

// Mapping status to styling & translation
const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  PENDING: { label: 'Chờ xử lý', bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', bg: 'bg-blue-50 border-blue-100', text: 'text-blue-700', icon: CheckCircle },
  SHIPPING: { label: 'Đang giao hàng', bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-700', icon: Truck },
  COMPLETED: { label: 'Đã hoàn thành', bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', bg: 'bg-rose-50 border-rose-100', text: 'text-rose-700', icon: XCircle },
};

const TABS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // States
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const pageSize = 5;
  const statusParam = activeTab === 'ALL' ? undefined : activeTab;

  // Queries & Mutations
  const { data: pageData, isLoading, isError } = useMyOrdersQuery(page, pageSize, statusParam);
  const { data: orderDetail, isLoading: isLoadingDetail } = useOrderDetailQuery(
    selectedOrderId || undefined,
    !!selectedOrderId
  );
  const cancelOrderMutation = useCancelOrderMutation();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Reset page to 1 when changing tabs
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setPage(1);
  };

  const handleCancelOrder = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      cancelOrderMutation.mutate(id, {
        onSuccess: () => {
          alert('Hủy đơn hàng thành công!');
        },
        onError: (err: unknown) => {
          const error = err as { message?: string };
          alert(error.message || 'Hủy đơn hàng thất bại');
        },
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const orders = pageData?.content || [];
  const totalPages = pageData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3 no-underline">
            <ArrowLeft size={16} />
            Quay lại trang chủ
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đơn hàng của tôi</h1>
          <p className="text-slate-500 text-sm mt-1">Xem và quản lý lịch sử đặt hàng của bạn</p>
        </div>

        {/* Tab filters */}
        <div className="mb-6 bg-white border border-slate-100 rounded-xl p-1 shadow-sm flex overflow-x-auto scrollbar-none gap-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`whitespace-nowrap px-4 py-2.5 text-sm font-bold rounded-lg transition-all flex-1 text-center ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-1/5"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-10 bg-slate-200 rounded w-1/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-6 text-center">
            Có lỗi xảy ra khi tải danh sách đơn hàng. Vui lòng thử lại sau.
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center flex flex-col items-center justify-center border-slate-100">
            <ShoppingBag size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy đơn hàng nào</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn chưa có đơn hàng nào ở trạng thái này.</p>
            <Link to="/">
              <Button className="bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl px-6">
                Mua sắm ngay
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || {
                label: order.status,
                bg: 'bg-slate-50 border-slate-100',
                text: 'text-slate-700',
                icon: Clock,
              };
              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={order.orderId}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
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
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={cancelOrderMutation.isPending}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl h-10 font-bold text-sm"
                      >
                        Hủy đơn
                      </Button>
                    )}
                    <Button
                      onClick={() => setSelectedOrderId(order.orderId)}
                      className="bg-slate-950 hover:bg-slate-900 text-white rounded-xl h-10 font-bold text-sm px-5 shadow-sm"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-slate-200 text-slate-600 rounded-xl p-2.5 h-10 w-10 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <span className="text-sm font-bold text-slate-600">
                  Trang {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-slate-200 text-slate-600 rounded-xl p-2.5 h-10 w-10 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Chi tiết đơn hàng #{selectedOrderId}</h3>
                {orderDetail && (
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Đặt ngày {formatDate(orderDetail.orderDate)}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
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
                    handleCancelOrder(selectedOrderId);
                    setSelectedOrderId(null); // Close modal after action
                  }}
                  disabled={cancelOrderMutation.isPending}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl h-11 font-bold text-sm"
                >
                  Hủy đơn hàng
                </Button>
              )}
              <Button
                onClick={() => setSelectedOrderId(null)}
                className="bg-slate-950 hover:bg-slate-900 text-white rounded-xl h-11 font-bold text-sm px-6 shadow-sm"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

// Inline Link helper to prevent extra dependencies
function Link({ to, children, className, ...props }: LinkProps) {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
