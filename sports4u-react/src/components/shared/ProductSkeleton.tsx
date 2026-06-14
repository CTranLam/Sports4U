import { Skeleton } from '../ui/skeleton';

interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 4 }: ProductSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          {/* Image Skeleton */}
          <Skeleton className="aspect-square w-full rounded-lg" />
          
          {/* Category Skeleton */}
          <Skeleton className="mt-4 h-3 w-1/4" />
          
          {/* Title Skeleton */}
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-4 w-1/2" />
          
          {/* Price & Action Skeleton */}
          <div className="mt-6 flex items-center justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}
