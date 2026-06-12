import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductApi';
import { useAddToCartMutation } from '../hooks/useCartApi';
import { useAuthStore } from '../store/useAuthStore';
import ProductGallery from './detail/ProductGallery';
import ProductSpecs from './detail/ProductSpecs';
import ProductActions from './detail/ProductActions';
import { Skeleton } from '../components/ui/skeleton';
import { ChevronRight, Home, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { data: response, isLoading, isError } = useProductDetail(id ? Number(id) : undefined);
  const product = response?.data;

  const addToCartMutation = useAddToCartMutation();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }

    if (!product) return;

    addToCartMutation.mutate(
      {
        productId: product.productId,
        quantity: quantity,
      },
      {
        onSuccess: (res) => {
          alert(res.message || 'Đã thêm vào giỏ hàng thành công!');
        },
        onError: (err) => {
          const axiosError = err as AxiosError<{ message?: string }>;
          alert(axiosError.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng');
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!product) return;

    const buyNowItem = {
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity,
    };

    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    navigate('/delivery');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 text-sm text-slate-400 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-2 pt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-600">
        <p className="font-semibold text-lg">Không tìm thấy thông tin sản phẩm.</p>
        <p className="text-slate-500 mt-2 text-sm">Vui lòng quay lại trang chủ và thử lại.</p>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="flex items-center gap-1 hover:text-slate-900 no-underline transition-colors">
          <Home size={14} />
          Trang chủ
        </Link>
        <ChevronRight size={14} className="text-slate-350" />
        <span className="text-slate-400 font-medium">Chi tiết sản phẩm</span>
        <ChevronRight size={14} className="text-slate-350" />
        <span className="text-slate-950 font-bold max-w-[200px] truncate">{product.productName}</span>
      </nav>

      {/* Main product detail row */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left Column: Image Gallery */}
        <ProductGallery imageUrl={product.imageUrl} name={product.productName} />

        {/* Right Column: Actions & Details */}
        <div className="flex flex-col">
          {/* Category */}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-2">
            {product.categoryName}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight mb-4">
            {product.productName}
          </h1>

          {/* Stock state */}
          <div className="mb-4">
            {product.inStock ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Còn hàng
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                Hết hàng
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formattedPrice}
            </span>
          </div>

          {/* Key policies / Highlights */}
          <div className="mb-6 space-y-3 rounded-2xl border border-slate-100 p-4.5 bg-slate-50/30">
            <div className="flex items-center gap-3 text-sm text-slate-650">
              <Truck size={18} className="text-slate-450 shrink-0" />
              <span>Giao hàng hỏa tốc trong 2h tại khu vực nội thành</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-650">
              <RotateCcw size={18} className="text-slate-450 shrink-0" />
              <span>Đổi trả sản phẩm dễ dàng trong vòng 7 ngày</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-650">
              <ShieldCheck size={18} className="text-slate-450 shrink-0" />
              <span>Cam kết 100% hàng chính hãng, phát hiện giả đền gấp đôi</span>
            </div>
          </div>

          {/* Product Description Tabs */}
          <ProductSpecs
            description={product.description}
            origin={product.origin}
            advantages={product.advantages}
            className="my-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          />

          {/* Product Actions */}
          <ProductActions
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isAddingToCart={addToCartMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
