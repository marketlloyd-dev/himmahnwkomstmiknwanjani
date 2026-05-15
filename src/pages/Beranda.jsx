import { useApp } from '../context/AppContext';
import { pengurusInti } from '../data/config';
import BannerSlider from '../components/BannerSlider';

export default function Beranda() {
  const { bannerImages, logo } = useApp();
  const { ketua, sekretaris, bendahara } = pengurusInti;

  const pengurusList = [
    { ...ketua, jabatan: 'Ketua Komisariat' },
    { ...sekretaris, jabatan: 'Sekretaris' },
    { ...bendahara, jabatan: 'Bendahara' },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#003d1c] via-[#004d24] to-[#006b32] py-12 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <img
            src={logo || '/img/logo.png'}
            alt="Logo HIMMAH NW"
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 object-contain rounded-full shadow-2xl animate-fadeIn"
            onError={(e) => { e.target.src = '/img/logo.png'; }}
          />
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-playfair font-bold text-white mb-3 animate-fadeIn">
            HIMMAH NW
          </h1>
          <p className="text-lg sm:text-2xl text-green-200 font-poppins font-medium animate-fadeIn">
            Komisariat STMIK
          </p>
          <p className="mt-4 text-green-300/80 max-w-2xl mx-auto text-sm sm:text-base animate-fadeIn">
            Himpunan Mahasiswa Nahdlatul Wathan — Bergerak, Mengabdi, Berprestasi
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <div className="mb-12 animate-fadeIn">
          <BannerSlider customBanners={bannerImages} />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-white text-center mb-8">
            Pengurus Inti Komisariat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pengurusList.map((person, index) => (
              <div key={index} className="glass p-6 rounded-2xl text-center hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-green-400/50 group-hover:border-green-400 transition-all">
                  <img
                    src={person.foto}
                    alt={person.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.nama)}&background=004d24&color=fff&size=150`;
                    }}
                  />
                </div>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full mb-2">
                  {person.jabatan}
                </span>
                <h3 className="text-white font-semibold text-lg">{person.nama}</h3>
                <p className="text-green-300/80 text-sm">NIM: {person.nim}</p>
                <p className="text-green-300/70 text-sm">{person.jurusan}</p>
                <p className="text-green-300/60 text-xs">Angkatan {person.angkatan}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}