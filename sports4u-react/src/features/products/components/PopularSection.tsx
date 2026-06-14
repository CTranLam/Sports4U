import { useState } from 'react';
import { usePopularProducts } from '../hooks/useProductApi';
import ProductCard from './ProductCard';
import ProductSkeleton from '@/components/shared/ProductSkeleton';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PopularSectionProps {
  parentId: number;
}

export default function PopularSection({ parentId }: PopularSectionProps) {
  const [page, setPage] = useState(1);
  const size = 4;

  const { data: response, isLoading, isError } = usePopularProducts(parentId, page, size);
  const pageData = response?.data;
  const products = pageData?.content || [];
  const totalPages = pageData?.totalPages || 1;
  const totalElements = pageData?.totalElements || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isError) {
    return (
      <div className="mb-8 rounded-xl border border-red-100 bg-red-50/50 p-6 text-center text-red-600">
        Không thể tải danh sách sản phẩm hot.
      </div>
    );
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <Flame size={22} className="fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sản phẩm nổi bật</h2>
            <p className="text-xs text-slate-500">Bán chạy nhất hệ thống ({totalElements} sản phẩm)</p>
          </div>
        </div>

        {/* Mini Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 mr-2">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-200"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-200"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Product list grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ProductSkeleton count={4} />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 py-10 text-center text-slate-500">
          Hiện chưa có sản phẩm nổi bật nào trong danh mục này.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-fadeIn">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
