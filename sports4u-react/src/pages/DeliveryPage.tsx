import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import {
  useOrderPreviewFromCart,
  useOrderPreviewFromProduct,
  useCheckoutFromCartMutation,
  useCheckoutFromProductMutation,
  useVnPayUrlMutation,
} from '@/features/orders/hooks/useOrderApi';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DeliveryReceiverInfo,
  DeliveryItemsTable,
  DeliverySummaryCard,
} from '@/features/orders/components';

interface SessionBuyNowItem {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function DeliveryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');
  const [checkoutError, setCheckoutError] = useState<string | null>(() => {
    return searchParams.get('error') ? 'Thanh toán VNPay thất bại hoặc đã bị hủy. Vui lòng thử lại.' : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  // Retrieve checkout sources from sessionStorage
  const buyNowItemStr = sessionStorage.getItem('buyNowItem');
  const selectedCartItemsStr = sessionStorage.getItem('selectedCartItems');

  const buyNowItem: SessionBuyNowItem | null = buyNowItemStr ? JSON.parse(buyNowItemStr) : null;
  const selectedCartItems: number[] = selectedCartItemsStr ? JSON.parse(selectedCartItemsStr) : [];

  const isBuyNow = !!buyNowItem;
  const isCartCheckout = !isBuyNow && selectedCartItems.length > 0;

  // Fetch previews
  const {
    data: cartPreviewData,
    isLoading: isCartPreviewLoading,
    error: cartPreviewError,
  } = useOrderPreviewFromCart(selectedCartItems, isCartCheckout);

  const {
    data: productPreviewData,
    isLoading: isProductPreviewLoading,
    error: productPreviewError,
  } = useOrderPreviewFromProduct(buyNowItem?.productId, buyNowItem?.quantity || 1, isBuyNow);

  const isLoading = isBuyNow ? isProductPreviewLoading : isCartPreviewLoading;
  const apiError = isBuyNow ? productPreviewError : cartPreviewError;

  // Normalized preview items list
  const previewItems = isBuyNow
    ? productPreviewData ? [productPreviewData] : []
    : cartPreviewData || [];

  // Mutations
  const checkoutFromCartMutation = useCheckoutFromCartMutation();
  const checkoutFromProductMutation = useCheckoutFromProductMutation();
  const vnPayUrlMutation = useVnPayUrlMutation();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if no items to checkout
  useEffect(() => {
    if (isOrderCompleted) return;
    if (!isLoading && previewItems.length === 0 && !apiError) {
      navigate('/cart');
    }
  }, [isLoading, previewItems.length, apiError, navigate, isOrderCompleted]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-slate-800 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải thông tin đơn hàng của bạn...</p>
      </div>
    );
  }

  // Address validation error handler
  if (apiError) {
    const errMsg = apiError.message || '';
    const needsAddressUpdate = errMsg.includes('địa chỉ') || errMsg.includes('address');

    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Không thể đặt hàng</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {needsAddressUpdate
              ? 'Tài khoản của bạn chưa cập nhật địa chỉ giao hàng nhận hàng. Vui lòng hoàn tất thông tin cá nhân trước khi thực hiện đặt hàng.'
              : errMsg || 'Đã xảy ra lỗi khi chuẩn bị đơn hàng.'}
          </p>
          
          {needsAddressUpdate ? (
            <Link to="/profile" className="w-full">
              <Button className="w-full bg-slate-950 hover:bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-md">
                Cập nhật địa chỉ ngay
              </Button>
            </Link>
          ) : (
            <Link to="/cart" className="w-full">
              <Button className="w-full bg-slate-950 hover:bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-md">
                Quay lại giỏ hàng
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Receiver info
  const firstItem = previewItems[0];
  const receiverName = firstItem?.fullName || 'Chưa cập nhật';
  const receiverPhone = firstItem?.phone || 'Chưa cập nhật';
  const deliveryAddress = firstItem?.fullAddress || 'Chưa cập nhật địa chỉ';

  // Calculations
  const subtotal = previewItems.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const handleConfirmOrder = async () => {
    try {
      setCheckoutError(null);
      setIsSubmitting(true);

      let orderId: number;

      if (isBuyNow && buyNowItem) {
        const response = await checkoutFromProductMutation.mutateAsync({
          productId: buyNowItem.productId,
          quantity: buyNowItem.quantity,
          paymentMethod: paymentMethod,
        });
        if (!response.data) {
          throw new Error('Không nhận được dữ liệu đơn hàng từ hệ thống.');
        }
        orderId = response.data.orderId;
      } else {
        const response = await checkoutFromCartMutation.mutateAsync({
          cartItemIds: selectedCartItems,
          paymentMethod: paymentMethod,
        });
        if (!response.data) {
          throw new Error('Không nhận được dữ liệu đơn hàng từ hệ thống.');
        }
        orderId = response.data.orderId;
      }

      if (paymentMethod === 'VNPAY') {
        const paymentUrl = await vnPayUrlMutation.mutateAsync(orderId);
        setIsOrderCompleted(true);
        sessionStorage.removeItem('buyNowItem');
        sessionStorage.removeItem('selectedCartItems');
        window.location.href = paymentUrl;
      } else {
        setIsOrderCompleted(true);
        alert('Đặt hàng thành công! Cảm ơn quý khách đã mua sắm tại Sports4U.');
        sessionStorage.removeItem('buyNowItem');
        sessionStorage.removeItem('selectedCartItems');
        navigate('/');
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setCheckoutError(error.message || 'Đặt hàng thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Xác nhận đơn hàng</h1>

        {checkoutError && (
          <div className="mb-6 bg-red-50 border border-red-150 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
            <span>{checkoutError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side */}
          <div className="lg:col-span-8 space-y-6">
            <DeliveryReceiverInfo
              receiverName={receiverName}
              receiverPhone={receiverPhone}
              deliveryAddress={deliveryAddress}
            />
            <DeliveryItemsTable previewItems={previewItems} />
          </div>

          {/* Right Side */}
          <div className="lg:col-span-4 space-y-6">
            <DeliverySummaryCard
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onSubmit={handleConfirmOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
