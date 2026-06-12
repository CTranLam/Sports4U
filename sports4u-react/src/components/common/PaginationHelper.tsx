import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface PaginationHelperProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationHelper({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationHelperProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 rounded-md border-slate-200"
      >
        <ChevronLeft size={16} />
      </Button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 rounded-md border-slate-200 font-semibold ${
            page === currentPage
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          {page}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 rounded-md border-slate-200"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
