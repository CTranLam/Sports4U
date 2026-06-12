import { useState } from 'react';
import { useParentCategories, useCategoryChild } from '../hooks/useProductApi';
import HeroBanner from './home/HeroBanner';
import PopularSection from './home/PopularSection';
import CategorySection from './home/CategorySection';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ListFilter } from 'lucide-react';

export default function HomePage() {
  const { data: parentRes, isLoading: isLoadingParents, isError: isErrorParents } = useParentCategories();
  const parents = parentRes?.data?.categories || [];

  const [activeParentId, setActiveParentId] = useState<number | null>(null);
  const selectedParentId = activeParentId || (parents.length > 0 ? parents[0].categoryId : undefined);

  // Fetch children of selected parent category
  const { data: childrenRes, isLoading: isLoadingChildren } = useCategoryChild(selectedParentId);
  const children = childrenRes?.data || [];

  if (isErrorParents) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600">
        <p className="font-semibold">Đã xảy ra lỗi khi kết nối tới máy chủ.</p>
        <p className="text-sm text-slate-500 mt-2">Vui lòng đảm bảo Backend Spring Boot đang chạy.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Sidebar (Desktop) / Horizontal scrolling bar (Mobile) */}
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          {/* Header */}
          <div className="mb-4 flex items-center gap-2 border-b pb-2">
            <ListFilter size={16} className="text-slate-500" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Danh mục thể thao
            </h5>
          </div>

          {/* List parents */}
          {isLoadingParents ? (
            <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 lg:w-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-row gap-2 overflow-x-auto pb-3 scrollbar-none lg:flex-col lg:overflow-visible">
              {parents.map((parent) => {
                const isActive = selectedParentId === parent.categoryId;
                return (
                  <Button
                    key={parent.categoryId}
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => setActiveParentId(parent.categoryId)}
                    className={`whitespace-nowrap px-4 py-2 text-sm font-semibold justify-start h-10 transition-all rounded-lg ${
                      isActive
                        ? 'bg-slate-900 text-white hover:bg-slate-900 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    } lg:w-full`}
                  >
                    {parent.categoryName}
                  </Button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Right Main Content */}
        <div className="flex-1 min-w-0">
          {/* Hero Banner */}
          <HeroBanner />

          {selectedParentId && (
            <div id="discover-section" className="scroll-mt-24">
              {/* Popular Products in this Parent Category */}
              <PopularSection parentId={selectedParentId} />

              {/* Subcategories list of products */}
              <div className="space-y-6">
                <div className="border-b pb-3 mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Khám phá theo danh mục
                  </h2>
                  <p className="text-sm text-slate-500">
                    Tìm kiếm các thiết bị phù hợp với từng môn tập của bạn
                  </p>
                </div>

                {isLoadingChildren ? (
                  <div className="space-y-12">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          {Array.from({ length: 4 }).map((_, j) => (
                            <Skeleton key={j} className="aspect-[3/4] rounded-xl" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : children.length === 0 ? (
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 py-12 text-center text-slate-500">
                    Chưa có danh mục con nào được tạo cho môn thể thao này.
                  </div>
                ) : (
                  children.map((child) => (
                    <CategorySection key={child.categoryId} childCategory={child} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
