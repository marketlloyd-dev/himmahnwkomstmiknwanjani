import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Quote } from 'lucide-react';

export default function Beranda() {
  const { bannerImages, logo, pengurus, berita } = useApp();

  const beritaTerbaru = berita.slice(0, 3);

  const currentPengurus = pengurus || {
    ketua: { nama: 'Ketua', foto: '/img/ketua.jpg' },
    sekretaris: { nama: 'Sekretaris', foto: '/img/sekretaris.jpg' },
    bendahara: { nama: 'Bendahara', foto: '/img/bendahara.jpg' },
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-br from-[#002b13] via-[#004d24] to-[#006b32] py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={bannerImages[0]?.src || '/img/banner1.jpg'}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <img
            src={logo || '/img/logo.png'}
            alt="Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 object-contain rounded-full shadow-2xl"
            onError={(e) => (e.target.src = '/img/logo.png')}
          />
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-white mb-4">
            HIMMAH NW
          </h1>
          <p className="text-xl sm:text-2xl text-green-200 font-light mb-6">
            Komisariat STMIK SZ NW anjani
          </p>
          <p className="text-green-300/80 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Himpunan Mahasiswa Nahdlatul Wathan — Wadah pergerakan, pengabdian, dan prestasi mahasiswa.
          </p>
          <Link
            to="/informasi"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all"
          >
            Kenali Kami <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* SAMBUTAN KETUA + PENGURUS INTI */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-16">
        {/* Sambutan */}
        <div className="glass p-6 sm:p-8 rounded-2xl mb-12 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-green-400/50 flex-shrink-0">
            <img
              src={currentPengurus.ketua.foto}
              alt="Ketua"
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.target.src = `https://ui-avatars.com/api/?name=Ketua&background=004d24&color=fff&size=150`)
              }
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Quote size={20} className="text-green-400" />
              <h3 className="text-white font-semibold text-lg">Sambutan Ketua</h3>
            </div>
            <p className="text-green-100/80 leading-relaxed text-sm sm:text-base">
              "Assalamu'alaikum warahmatullahi wabarakatuh. Puji syukur kehadirat Allah SWT
              yang telah memberikan kita nikmat iman dan Islam. HIMMAH NW Komisariat STMIK
              hadir sebagai wadah bagi mahasiswa untuk mengembangkan potensi diri dalam
              bidang keagamaan, akademik, dan sosial kemasyarakatan..."
            </p>
            <p className="text-green-300 font-medium mt-2">
              — {currentPengurus.ketua.nama}
            </p>
          </div>
        </div>

        {/* PENGURUS INTI — Layout horizontal di HP, grid 3 di desktop */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-white text-center mb-8">
            Pengurus Inti
          </h2>

          {/* Container: flex di HP (scroll horizontal), grid di ≥640px */}
          <div className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto snap-x sm:snap-none pb-4">
            {/* Sekretaris */}
            <div className="glass p-4 rounded-2xl text-center hover:scale-[1.02] transition-all shrink-0 w-40 sm:w-auto snap-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-green-400/50 mb-3">
                <img
                  src={currentPengurus.sekretaris.foto}
                  alt="Sekretaris"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                Sekretaris
              </span>
              <p className="text-white font-medium text-sm mt-1">
                {currentPengurus.sekretaris.nama}
              </p>
            </div>

            {/* Ketua — sedikit lebih besar */}
            <div className="glass p-6 rounded-2xl text-center hover:scale-[1.02] transition-all shrink-0 w-48 sm:w-auto snap-center sm:-mt-6">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-yellow-400/50 mb-3 shadow-lg">
                <img
                  src={currentPengurus.ketua.foto}
                  alt="Ketua"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full font-semibold">
                Ketua Umum
              </span>
              <p className="text-white font-bold text-lg mt-2">
                {currentPengurus.ketua.nama}
              </p>
            </div>

            {/* Bendahara */}
            <div className="glass p-4 rounded-2xl text-center hover:scale-[1.02] transition-all shrink-0 w-40 sm:w-auto snap-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-green-400/50 mb-3">
                <img
                  src={currentPengurus.bendahara.foto}
                  alt="Bendahara"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                Bendahara
              </span>
              <p className="text-white font-medium text-sm mt-1">
                {currentPengurus.bendahara.nama}
              </p>
            </div>
          </div>
        </div>

        {/* BERITA TERBARU */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-white">
              Berita Terbaru
            </h2>
            <Link
              to="/berita"
              className="text-green-300 hover:text-green-200 flex items-center gap-1 text-sm"
            >
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {beritaTerbaru.map((item) => (
              <Link
                key={item.id}
                to="/berita"
                className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition-all group"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={item.foto}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) =>
                      (e.target.src = 'https://placehold.co/400x200/004d24/ffffff?text=HIMMAH+NW')
                    }
                  />
                </div>
                <div className="p-3">
                  <span className="text-xs text-green-300/70 flex items-center gap-1 mb-1">
                    <Calendar size={12} /> {item.tanggal}
                  </span>
                  <h3 className="text-white font-semibold text-sm line-clamp-2">
                    {item.judul}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}