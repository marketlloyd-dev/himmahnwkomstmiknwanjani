import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, X } from 'lucide-react';

export default function SeputarHimmah() {
  const { berita } = useApp();
  const [selectedBerita, setSelectedBerita] = useState(null);

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-12 sm:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-white">Seputar HIMMAH NW</h1>
        <p className="text-green-300 mt-2">Berita & Kegiatan Terkini Komisariat</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {berita.length === 0 ? (
          <div className="glass p-12 text-center rounded-2xl">
            <p className="text-green-300/60">Belum ada berita.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {berita.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedBerita(item)}
                className="glass rounded-2xl overflow-hidden hover:scale-[1.01] transition-all group cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.foto}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x300/004d24/ffffff?text=HIMMAH+NW';
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-xs text-green-300/70 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {item.tanggal}
                    </span>
                    {item.kategori && (
                      <span className="bg-green-500/15 px-2 py-0.5 rounded-full text-green-300">
                        {item.kategori}
                      </span>
                    )}
                  </div>
                  <h2 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-300 transition-colors">
                    {item.judul}
                  </h2>
                  <p className="text-green-100/70 text-sm line-clamp-3 leading-relaxed">
                    {item.redaksi}
                  </p>
                  <div className="mt-3 text-green-400/60 text-xs">
                    Klik untuk baca selengkapnya →
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Berita */}
      {selectedBerita && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedBerita(null)}
        >
          <div
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">{selectedBerita.judul}</h2>
              <button
                onClick={() => setSelectedBerita(null)}
                className="text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-green-300/70">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {selectedBerita.tanggal}
              </span>
              {selectedBerita.kategori && (
                <span className="bg-green-500/15 px-2 py-0.5 rounded-full text-green-300">
                  {selectedBerita.kategori}
                </span>
              )}
            </div>

            {selectedBerita.foto && (
              <img
                src={selectedBerita.foto}
                alt={selectedBerita.judul}
                className="w-full rounded-xl object-cover max-h-64"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x300/004d24/ffffff?text=HIMMAH+NW';
                }}
              />
            )}

            <div className="text-green-100/80 leading-relaxed whitespace-pre-wrap">
              {selectedBerita.redaksi}
            </div>

            <button
              onClick={() => setSelectedBerita(null)}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}