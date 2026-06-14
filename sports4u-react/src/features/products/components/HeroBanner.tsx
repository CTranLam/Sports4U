import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  const handleScrollToDiscover = () => {
    const element = document.getElementById('discover-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-slate-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-40">
        <img
          src="/assets/banner-img.png"
          alt="Sports4U Banner"
          className="h-full w-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200';
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-20 md:max-w-2xl">
        <span className="inline-block rounded-full bg-red-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
          Mùa Hè Sôi Động
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Nâng Tầm Trải Nghiệm Thể Thao
        </h1>
        <p className="mt-4 text-base text-slate-300 sm:text-lg">
          Khám phá bộ sưu tập vợt Pickleball, Tennis và các trang phục thể thao chính hãng cao cấp từ Sports4U. Giảm giá lên đến 50% hôm nay!
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            size="lg"
            className="bg-white text-slate-950 hover:bg-slate-100 font-semibold cursor-pointer"
            onClick={handleScrollToDiscover}
          >
            Mua ngay
            <ArrowRight size={16} className="ml-1.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 cursor-pointer"
            onClick={handleScrollToDiscover}
          >
            Tìm hiểu thêm
          </Button>
        </div>
      </div>
    </div>
  );
}
