import { Link } from 'react-router-dom';
import { useCategoryProducts } from '../../hooks/useProductApi';
import ProductCard from '../../components/common/ProductCard';
import ProductSkeleton from '../../components/common/ProductSkeleton';
import type { CategoryDTO } from '../../types/api';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  childCategory: CategoryDTO;
}

export default function CategorySection({ childCategory }: CategorySectionProps) {
  const { data: response, isLoading, isError } = useCategoryProducts(
    childCategory.categoryId,
    1,
    4
  );
  const products = response?.data?.content || [];

  if (isError) {
    return null; // Skip rendering this category if there's an error
  }

  // If not loading and has no products, we can choose to skip rendering or show empty message.
  // The static page showed: "Chưa có sản phẩm nào trong danh mục này". Let's show it or hide it.
  // Showing it helps discover empty categories.
  
  return (
    <section className="mb-12">
      {/* Category Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          {childCategory.categoryName}
        </h3>
        <Link
          to={`/categories/${childCategory.categoryId}?name=${encodeURIComponent(childCategory.categoryName)}`}
          className="flex items-center text-sm font-semibold text-slate-900 hover:text-slate-600 no-underline transition-colors group"
        >
          Xem tất cả
          <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Product List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ProductSkeleton count={4} />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 py-8 text-center text-sm text-slate-500">
          Chưa có sản phẩm nào trong danh mục này.
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
