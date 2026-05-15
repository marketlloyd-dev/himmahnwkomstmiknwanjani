import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultBanners = [
  { id: 1, src: '/img/banner1.jpg', alt: 'Kegiatan Bakti Sosial' },
  { id: 2, src: '/img/banner2.jpg', alt: 'Seminar Nasional' },
  { id: 3, src: '/img/banner3.jpg', alt: 'Pelantikan Pengurus' },
];

export default function BannerSlider({ customBanners = [] }) {
  const banners = customBanners.length > 0 ? customBanners : defaultBanners;
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, banners.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length);
  }, [current, banners.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  if (banners.length === 0) {
    return (
      <div className="w-full h-48 sm:h-64 lg:h-80 rounded-2xl glass flex items-center justify-center text-white/60">
        Belum ada banner
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl glass group">
      <div className="relative h-48 sm:h-64 lg:h-80">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === current ? 'opacity-100 translate-x-0' : index < current ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
            }`}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => { e.target.src = 'https://placehold.co/800x400/004d24/ffffff?text=HIMMAH+NW'; }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 rounded-b-2xl">
              <p className="text-white font-semibold text-sm sm:text-lg">{banner.alt}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all">
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}