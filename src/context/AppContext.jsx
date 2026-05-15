import { createContext, useContext, useState, useEffect } from 'react';

const defaultPengurus = {
  ketua: {
    nama: 'Ahmad Fauzi',
    nim: '210101001',
    foto: '/img/ketua.jpg',
    jurusan: 'Teknik Informatika',
    angkatan: '2021',
  },
  sekretaris: {
    nama: 'Siti Nurhaliza',
    nim: '210101002',
    foto: '/img/sekretaris.jpg',
    jurusan: 'Sistem Informasi',
    angkatan: '2021',
  },
  bendahara: {
    nama: 'Rudi Hartono',
    nim: '210101003',
    foto: '/img/bendahara.jpg',
    jurusan: 'Teknik Informatika',
    angkatan: '2022',
  },
};

const defaultDivisi = [
  {
    id: 1,
    nama: 'Divisi Dakwah & Keagamaan',
    programKerja: [
      'Pengajian Rutin Mingguan',
      'Peringatan Hari Besar Islam',
      'Kajian Kitab Kuning',
      'Pelatihan Tilawah & Tartil',
    ],
    anggota: ['Muhammad Ali (Kadiv)', 'Hasan Basri', 'Ahmad Syafi\'i', 'Zainuddin'],
  },
  {
    id: 2,
    nama: 'Divisi Pendidikan & Pelatihan',
    programKerja: [
      'Seminar Teknologi',
      'Workshop Programming',
      'Pelatihan Desain Grafis',
      'Study Club',
    ],
    anggota: ['Baiq Dewi (Kadiv)', 'Lalu Rahman', 'Rizki Maulana', 'Fitriani'],
  },
  {
    id: 3,
    nama: 'Divisi Sosial & Kemasyarakatan',
    programKerja: [
      'Bakti Sosial',
      'Santunan Anak Yatim',
      'Bersih Lingkungan',
      'Donor Darah',
    ],
    anggota: ['Abdul Hamid (Kadiv)', 'Nurul Hidayah', 'Samsul Arifin', 'Rina Agustina'],
  },
  {
    id: 4,
    nama: 'Divisi Minat & Bakat',
    programKerja: [
      'Futsal Competition',
      'Pentas Seni',
      'Lomba Debat',
      'Pelatihan Public Speaking',
    ],
    anggota: ['Fajar Ramadhan (Kadiv)', 'Baiq Aulia', 'Dimas Saputra', 'Maya Sari'],
  },
];

const defaultBerita = [
  {
    id: 1,
    judul: 'HIMMAH NW STMIK Gelar Bakti Sosial di Desa Sembalun',
    tanggal: '2024-12-10',
    foto: '/img/banner1.jpg',
    redaksi: 'Kegiatan bakti sosial yang diadakan oleh HIMMAH NW Komisariat STMIK berlangsung sukses di Desa Sembalun...',
    kategori: 'Sosial',
  },
  {
    id: 2,
    judul: 'Seminar Nasional Teknologi 4.0 Bersama Pakar IT',
    tanggal: '2024-11-25',
    foto: '/img/banner2.jpg',
    redaksi: 'Bertempat di Aula Kampus STMIK, seminar nasional ini menghadirkan pakar IT...',
    kategori: 'Pendidikan',
  },
  {
    id: 3,
    judul: 'Pelantikan Pengurus Baru HIMMAH NW Periode 2024-2025',
    tanggal: '2024-11-01',
    foto: '/img/banner3.jpg',
    redaksi: 'Prosesi pelantikan pengurus baru berjalan khidmat...',
    kategori: 'Organisasi',
  },
];

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [berita, setBerita] = useState([]);
  const [divisi, setDivisi] = useState(defaultDivisi);
  const [pengurus, setPengurus] = useState(defaultPengurus);
  const [bannerImages, setBannerImages] = useState([]);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const savedBerita = localStorage.getItem('himmah_berita');
    const savedDivisi = localStorage.getItem('himmah_divisi');
    const savedPengurus = localStorage.getItem('himmah_pengurus');
    const savedBanner = localStorage.getItem('himmah_banner');
    const savedLogo = localStorage.getItem('himmah_logo');
    const savedLogin = localStorage.getItem('himmah_login');

    if (savedBerita) {
      try { setBerita(JSON.parse(savedBerita)); } catch { setBerita(defaultBerita); }
    } else {
      setBerita(defaultBerita);
      localStorage.setItem('himmah_berita', JSON.stringify(defaultBerita));
    }

    if (savedDivisi) {
      try { setDivisi(JSON.parse(savedDivisi)); } catch { setDivisi(defaultDivisi); }
    } else {
      localStorage.setItem('himmah_divisi', JSON.stringify(defaultDivisi));
    }

    if (savedPengurus) {
      try { setPengurus(JSON.parse(savedPengurus)); } catch { setPengurus(defaultPengurus); }
    }

    if (savedBanner) {
      try { setBannerImages(JSON.parse(savedBanner)); } catch { setBannerImages([]); }
    }

    if (savedLogo) setLogo(savedLogo);

    if (savedLogin === 'true') setIsLoggedIn(true);
  }, []);

  const saveBerita = (data) => {
    setBerita(data);
    localStorage.setItem('himmah_berita', JSON.stringify(data));
  };

  const saveDivisi = (data) => {
    setDivisi(data);
    localStorage.setItem('himmah_divisi', JSON.stringify(data));
  };

  const savePengurus = (data) => {
    setPengurus(data);
    localStorage.setItem('himmah_pengurus', JSON.stringify(data));
  };

  const saveBanner = (data) => {
    setBannerImages(data);
    localStorage.setItem('himmah_banner', JSON.stringify(data));
  };

  const saveLogo = (url) => {
    setLogo(url);
    if (url) localStorage.setItem('himmah_logo', url);
    else localStorage.removeItem('himmah_logo');
  };

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('himmah_login', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('himmah_login');
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn, login, logout,
        berita, saveBerita,
        divisi, saveDivisi,
        pengurus, savePengurus,
        bannerImages, saveBanner,
        logo, saveLogo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);