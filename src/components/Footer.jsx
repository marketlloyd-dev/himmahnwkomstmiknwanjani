import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#002b13] border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-playfair font-bold text-lg mb-3">HIMMAH NW</h3>
            <p className="text-green-300/60 text-sm">Komisariat STMIK</p>
            <p className="text-green-300/50 text-xs mt-2">Himpunan Mahasiswa Nahdlatul Wathan</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Kontak</h4>
            <div className="space-y-2 text-green-300/60 text-sm">
              <p className="flex items-center gap-2"><MapPin size={14} /> Kampus STMIK</p>
              <p className="flex items-center gap-2"><Phone size={14} /> 08xx-xxxx-xxxx</p>
              <p className="flex items-center gap-2"><Mail size={14} /> himmah@stmik.ac.id</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Navigasi</h4>
            <div className="space-y-1 text-green-300/60 text-sm">
              <p>Beranda</p>
              <p>Informasi</p>
              <p>Seputar HIMMAH</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-green-300/40 text-xs">
          &copy; {new Date().getFullYear()} HIMMAH NW Komisariat STMIK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}