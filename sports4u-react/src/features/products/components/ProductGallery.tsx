interface ProductGalleryProps {
  imageUrl: string;
  name: string;
}

export default function ProductGallery({ imageUrl, name }: ProductGalleryProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-center p-4">
        <img
          src={imageUrl || defaultImage}
          alt={name}
          loading="eager"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
      </div>

      {/* Decorative Thumbnails (mocked for visual richness) */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <button
            key={i}
            className={`aspect-square overflow-hidden rounded-xl border-2 bg-slate-50 p-1 flex items-center justify-center transition-all ${
              i === 0 ? 'border-slate-900 bg-white' : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <img
              src={imageUrl || defaultImage}
              alt={`${name} thumbnail ${i}`}
              className="h-full w-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
