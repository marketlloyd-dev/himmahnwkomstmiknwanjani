import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, X, Send, ArrowLeft, Clock, Tag, User, MessageCircle } from 'lucide-react';

export default function SeputarHimmah() {
  const { berita } = useApp();
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [komentar, setKomentar] = useState('');
  const [daftarKomentar, setDaftarKomentar] = useState(() => {
    const saved = localStorage.getItem('himmah_komentar');
    return saved ? JSON.parse(saved) : {};
  });

  const saveKomentar = (beritaId, newKomentar) => {
    const updated = {
      ...daftarKomentar,
      [beritaId]: [...(daftarKomentar[beritaId] || []), newKomentar]
    };
    setDaftarKomentar(updated);
    localStorage.setItem('himmah_komentar', JSON.stringify(updated));
  };

  const handleKirimKomentar = (beritaId) => {
    if (!komentar.trim()) return;
    saveKomentar(beritaId, { teks: komentar, timestamp: new Date().toISOString() });
    setKomentar('');
  };

  if (selectedBerita) {
    return (
      <div className="min-h-screen pb-16">
        <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <button
              onClick={() => setSelectedBerita(null)}
              className="flex items-center gap-2 text-green-300 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Kembali ke daftar berita</span>
            </button>
            <h1 className="text-2xl sm:text-4xl font-playfair font-bold text-white leading-tight">
              {selectedBerita.judul}
            </h1>
            <div className="flex items-center gap-4 text-sm text-green-300/70 mt-4">
              <span className="flex items-center gap-1"><Calendar size={16} /> {selectedBerita.tanggal}</span>
              {selectedBerita.kategori && (
                <span className="flex items-center gap-1"><Tag size={16} /> {selectedBerita.kategori}</span>
              )}
              <span className="flex items-center gap-1"><User size={16} /> Admin HIMMAH</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-12">
          {/* Foto Sampul */}
          {selectedBerita.foto && (
            <div className="glass rounded-2xl overflow-hidden mb-8">
              <img
                src={selectedBerita.foto}
                alt={selectedBerita.judul}
                className="w-full max-h-96 object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/800x400/004d24/ffffff?text=HIMMAH+NW'; }}
              />
            </div>
          )}

          {/* Konten HTML */}
          <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
            <div
              className="prose prose-invert max-w-none text-green-100/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedBerita.kontenHTML || selectedBerita.redaksi || '' }}
            />
          </div>

          {/* Komentar */}
          <div className="glass rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-green-400" />
              <h3 className="text-white font-bold text-lg">Komentar</h3>
              <span className="text-green-400/50 text-sm">
                ({daftarKomentar[selectedBerita.id]?.length || 0})
              </span>
            </div>

            {(!daftarKomentar[selectedBerita.id] || daftarKomentar[selectedBerita.id].length === 0) && (
              <p className="text-green-300/50 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
            )}
            {daftarKomentar[selectedBerita.id]?.map((k, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <User size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Anonim</p>
                    <p className="text-green-400/50 text-xs flex items-center gap-1">
                      <Clock size={10} /> {new Date(k.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <p className="text-green-100/80 text-sm mt-2">{k.teks}</p>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <textarea
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                placeholder="Tulis komentar..."
                rows={3}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-green-400"
              />
              <button
                onClick={() => handleKirimKomentar(selectedBerita.id)}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center gap-2 self-end transition-colors"
              >
                <Send size={16} /> Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <div
                    className="text-green-100/70 text-sm line-clamp-3 leading-relaxed opacity-70"
                    dangerouslySetInnerHTML={{
                      __html: (item.kontenHTML || item.redaksi || '').replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                    }}
                  />
                  <div className="mt-3 text-green-400/60 text-xs flex items-center justify-between">
                    <span>Baca selengkapnya →</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} /> {daftarKomentar[item.id]?.length || 0}
                    </span>
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