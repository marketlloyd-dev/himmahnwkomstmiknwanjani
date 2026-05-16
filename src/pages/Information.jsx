import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataKomisariat } from '../data/config';
import { ChevronDown, ChevronUp, Users, Target } from 'lucide-react';

export default function Information() {
  const { divisi, pengurus } = useApp();
  const [expandedDivisi, setExpandedDivisi] = useState(null);

  const defaultPengurus = {
    ketua: { nama: 'Ketua', foto: '/img/ketua.jpg', jurusan: '-' },
    sekretaris: { nama: 'Sekretaris', foto: '/img/sekretaris.jpg', jurusan: '-' },
    bendahara: { nama: 'Bendahara', foto: '/img/bendahara.jpg', jurusan: '-' },
  };
  const currentPengurus = pengurus || defaultPengurus;
  const { ketua, sekretaris, bendahara } = currentPengurus;

  const pengurusList = [
    { ...sekretaris, jabatan: 'Sekretaris' },
    { ...ketua, jabatan: 'Ketua Komisariat' },
    { ...bendahara, jabatan: 'Bendahara' },
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-12 sm:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-white">Informasi Komisariat</h1>
        <p className="text-green-300 mt-2">Mengenal lebih dekat HIMMAH NW Komisariat STMIK</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Sejarah */}
        <div className="glass p-6 sm:p-8 rounded-2xl mb-8 animate-fadeIn">
          <h2 className="text-2xl font-playfair font-bold text-white mb-4">Sejarah Komisariat</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
              Berdiri Tahun {dataKomisariat.tahunBerdiri}
            </span>
          </div>
          <p className="text-green-100/80 leading-relaxed">{dataKomisariat.deskripsi}</p>
        </div>

        {/* PENGURUS INTI — horizontal di HP, grid 3 di desktop */}
        <div className="mb-10">
          <h2 className="text-2xl font-playfair font-bold text-white text-center mb-6">Pengurus Inti</h2>

          <div className="flex sm:grid sm:grid-cols-3 gap-6 overflow-x-auto snap-x sm:snap-none pb-4">
            {pengurusList.map((person, index) => (
              <div
                key={index}
                className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all shrink-0 w-64 sm:w-auto snap-center"
              >
                <div className="h-48 sm:h-64 overflow-hidden">
                  <img
                    src={person.foto}
                    alt={person.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.nama)}&background=004d24&color=fff&size=300`;
                    }}
                  />
                </div>
                <div className="p-4 text-center">
                  <span className="text-xs font-semibold bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                    {person.jabatan}
                  </span>
                  <h3 className="text-white font-bold text-lg mt-2">{person.nama}</h3>
                  <p className="text-green-300/70 text-sm">{person.jurusan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divisi */}
        <div>
          <h2 className="text-2xl font-playfair font-bold text-white text-center mb-6 flex items-center justify-center gap-2">
            <Users size={24} /> Divisi & Program Kerja
          </h2>
          <div className="space-y-4">
            {divisi.map((d) => (
              <div key={d.id} className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedDivisi(expandedDivisi === d.id ? null : d.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Target size={20} className="text-green-400" />
                    <span className="text-white font-semibold">{d.nama}</span>
                  </div>
                  {expandedDivisi === d.id ? (
                    <ChevronUp size={20} className="text-green-400" />
                  ) : (
                    <ChevronDown size={20} className="text-green-400" />
                  )}
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    expandedDivisi === d.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-5 space-y-3">
                    <div>
                      <h4 className="text-green-300 font-semibold text-sm mb-2">📋 Program Kerja:</h4>
                      <ul className="space-y-1">
                        {d.programKerja.map((proker, i) => (
                          <li key={i} className="text-green-100/80 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                            {proker}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-green-300 font-semibold text-sm mb-2">👥 Anggota:</h4>
                      <ul className="space-y-1">
                        {d.anggota.map((anggota, i) => (
                          <li key={i} className="text-green-100/80 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400/60 rounded-full"></span>
                            {anggota}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}