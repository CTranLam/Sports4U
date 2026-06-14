import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail, useRelatedProducts } from '@/features/products/hooks/useProductApi';
import { useAddToCartMutation } from '@/features/cart/hooks/useCartApi';
import { useAuthStore } from '@/store/useAuthStore';
import { ProductGallery, ProductSpecs, ProductActions } from '@/features/products/components';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Home, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '@/features/products/components/ProductCard';
import ProductSkeleton from '@/components/shared/ProductSkeleton';
import { useReviews, useRatingSummary, useCreateReviewMutation } from '@/features/products/hooks/useReviewApi';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { data: response, isLoading, isError } = useProductDetail(id ? Number(id) : undefined);
  const product = response?.data;

  const { data: relatedResponse, isLoading: isLoadingRelated } = useRelatedProducts(id ? Number(id) : undefined);
  const relatedProducts = relatedResponse?.data || [];
  console.log("relatedProducts debug:", { id, relatedProducts, isLoadingRelated });

  // Review states and hooks
  const [reviewPage, setReviewPage] = useState(1);
  const { data: reviewsResponse, isLoading: isLoadingReviews } = useReviews(id ? Number(id) : undefined, reviewPage, 5);
  const reviewsData = reviewsResponse?.data;
  const reviews = reviewsData?.content || [];

  const { data: ratingSummaryResponse } = useRatingSummary(id ? Number(id) : undefined);
  const ratingSummary = ratingSummaryResponse?.data;

  const createReviewMutation = useCreateReviewMutation();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [showPurchaseRequiredModal, setShowPurchaseRequiredModal] = useState(false);
 
  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

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
        onError: (err: Error) => {
          alert(err.message || 'Không thể thêm sản phẩm vào giỏ hàng');
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để tiến hành mua hàng');
      navigate('/login');
      return;
    }

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
    <div key={id} className="container mx-auto px-4 py-8">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight mb-2">
            {product.productName}
          </h1>

          {/* Rating Summary */}
          {ratingSummary && ratingSummary.totalReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(ratingSummary.averageRating) ? 'fill-current' : 'text-slate-200'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900 mt-0.5">
                {ratingSummary.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400 mt-0.5">
                ({ratingSummary.totalReviews} đánh giá)
              </span>
            </div>
          )}

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

      {/* Reviews & Ratings Section */}
      <div className="mt-16 border-t border-slate-100 pt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Đánh giá khách hàng</h2>
            {ratingSummary && ratingSummary.totalReviews > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.round(ratingSummary.averageRating) ? 'fill-current' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-700 mt-0.5">
                  {ratingSummary.averageRating.toFixed(1)} / 5.0
                </span>
                <span className="text-sm text-slate-400 mt-0.5">
                  ({ratingSummary.totalReviews} nhận xét)
                </span>
              </div>
            )}
          </div>
          
          {!showReviewForm && (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                } else {
                  setShowReviewForm(true);
                }
              }}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Viết đánh giá
            </button>
          )}
        </div>

        {/* Review Form Card */}
        {showReviewForm && (
          <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Đánh giá của bạn về sản phẩm</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setReviewError('');
                try {
                  await createReviewMutation.mutateAsync({
                    productId: Number(id),
                    rating: newRating,
                    comment: newComment,
                  });
                  setNewComment('');
                  setNewRating(5);
                  setShowReviewForm(false);
                } catch (err) {
                  const errMsg = err instanceof Error ? err.message : 'Không thể gửi đánh giá. Vui lòng thử lại sau.';
                  if (
                    errMsg.includes("đánh giá sản phẩm sau khi đã mua hàng") ||
                    errMsg.includes("chưa mua") ||
                    errMsg.includes("mua hàng thành công")
                  ) {
                    setReviewError('Vui lòng mua sản phẩm để thực hiện đánh giá.');
                    setShowPurchaseRequiredModal(true);
                  } else {
                    setReviewError(errMsg);
                  }
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chọn số sao</label>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewRating(i + 1)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={28}
                        className={i < newRating ? 'fill-current' : 'text-slate-200'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nhận xét của bạn</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {reviewError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-2">{reviewError}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewError('');
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  {createReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {isLoadingReviews ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-2 py-4 border-b border-slate-100">
                <div className="h-4 bg-slate-200 w-1/4 rounded"></div>
                <div className="h-4 bg-slate-200 w-1/6 rounded"></div>
                <div className="h-3 bg-slate-200 w-3/4 rounded mt-2"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            <div className="divide-y divide-slate-100">
              {reviews.map((r) => (
                <div key={r.reviewId} className="py-6 first:pt-0">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="font-bold text-sm text-slate-900">{r.fullName}</span>
                    <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center text-amber-400 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < r.rating ? 'fill-current' : 'text-slate-200'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-650 leading-relaxed whitespace-pre-line">{r.comment}</p>
                </div>
              ))}
            </div>

            {/* Reviews Pagination */}
            {reviewsData && reviewsData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setReviewPage((prev) => Math.max(1, prev - 1))}
                  disabled={reviewPage === 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Trang trước
                </button>
                <span className="text-sm text-slate-500 font-medium">
                  Trang {reviewPage} / {reviewsData.totalPages}
                </span>
                <button
                  onClick={() => setReviewPage((prev) => Math.min(reviewsData.totalPages, prev + 1))}
                  disabled={reviewPage === reviewsData.totalPages}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/20">
            <p className="text-sm text-slate-500 font-medium">Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-xs text-slate-400 mt-1">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm!</p>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {(isLoadingRelated || relatedProducts.length > 0) && (
        <div className="mt-16 border-t border-slate-100 pt-12">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Sản phẩm liên quan</h2>
          {isLoadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ProductSkeleton count={4} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Purchase Required Modal */}
      {showPurchaseRequiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-6">
              <ShieldCheck size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Yêu cầu mua sản phẩm</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Bạn cần mua sản phẩm này và hoàn thành đơn hàng để có thể viết đánh giá.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowPurchaseRequiredModal(false);
                  handleBuyNow();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                Mua ngay sản phẩm
              </button>
              <button
                onClick={() => setShowPurchaseRequiredModal(false)}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
