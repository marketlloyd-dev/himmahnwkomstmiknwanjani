import { useApp } from '../context/AppContext';
import { Calendar, User } from 'lucide-react';

export default function SeputarHimmah() {
  const { berita } = useApp();

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
              <article key={item.id} className="glass rounded-2xl overflow-hidden hover:scale-[1.01] transition-all group">
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
                    <span className="flex items-center gap-1"><Calendar size={12} /> {item.tanggal}</span>
                    {item.kategori && (
                      <span className="bg-green-500/15 px-2 py-0.5 rounded-full text-green-300">{item.kategori}</span>
                    )}
                  </div>
                  <h2 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-300 transition-colors">
                    {item.judul}
                  </h2>
                  <p className="text-green-100/70 text-sm line-clamp-3 leading-relaxed">{item.redaksi}</p>
                  <div className="mt-3 flex items-center gap-2 text-green-400/60 text-xs">
                    <User size={12} /> Admin HIMMAH
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}