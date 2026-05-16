import { createContext, useContext, useState, useEffect } from 'react';

// Default hanya dipakai jika tidak ada data sama sekali
const defaultPengurus = {
  ketua: { nama: 'Ketua', foto: '/img/ketua.jpg', nim: '-', jurusan: '-', angkatan: '-' },
  sekretaris: { nama: 'Sekretaris', foto: '/img/sekretaris.jpg', nim: '-', jurusan: '-', angkatan: '-' },
  bendahara: { nama: 'Bendahara', foto: '/img/bendahara.jpg', nim: '-', jurusan: '-', angkatan: '-' },
};

const defaultDivisi = [
  {
    id: 1, nama: 'Divisi Dakwah & Keagamaan',
    programKerja: ['Pengajian Rutin Mingguan', 'Peringatan Hari Besar Islam', 'Kajian Kitab Kuning', 'Pelatihan Tilawah & Tartil'],
    anggota: ['Muhammad Ali (Kadiv)', 'Hasan Basri', 'Ahmad Syafi\'i', 'Zainuddin'],
  },
  {
    id: 2, nama: 'Divisi Pendidikan & Pelatihan',
    programKerja: ['Seminar Teknologi', 'Workshop Programming', 'Pelatihan Desain Grafis', 'Study Club'],
    anggota: ['Baiq Dewi (Kadiv)', 'Lalu Rahman', 'Rizki Maulana', 'Fitriani'],
  },
  {
    id: 3, nama: 'Divisi Sosial & Kemasyarakatan',
    programKerja: ['Bakti Sosial', 'Santunan Anak Yatim', 'Bersih Lingkungan', 'Donor Darah'],
    anggota: ['Abdul Hamid (Kadiv)', 'Nurul Hidayah', 'Samsul Arifin', 'Rina Agustina'],
  },
  {
    id: 4, nama: 'Divisi Minat & Bakat',
    programKerja: ['Futsal Competition', 'Pentas Seni', 'Lomba Debat', 'Pelatihan Public Speaking'],
    anggota: ['Fajar Ramadhan (Kadiv)', 'Baiq Aulia', 'Dimas Saputra', 'Maya Sari'],
  },
];

const defaultBerita = [
  {
    id: 1, judul: 'HIMMAH NW STMIK Gelar Bakti Sosial di Desa Sembalun',
    tanggal: '2024-12-10', foto: '/img/banner1.jpg',
    redaksi: 'Kegiatan bakti sosial yang diadakan oleh HIMMAH NW Komisariat STMIK...',
    kategori: 'Sosial',
  },
  {
    id: 2, judul: 'Seminar Nasional Teknologi 4.0 Bersama Pakar IT',
    tanggal: '2024-11-25', foto: '/img/banner2.jpg',
    redaksi: 'Bertempat di Aula Kampus STMIK...',
    kategori: 'Pendidikan',
  },
  {
    id: 3, judul: 'Pelantikan Pengurus Baru HIMMAH NW Periode 2024-2025',
    tanggal: '2024-11-01', foto: '/img/banner3.jpg',
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
  const [dataLoaded, setDataLoaded] = useState(false);

  const DATA_BLOB_URL = 'https://trwurgahpjquoqvn.public.blob.vercel-storage.com/data.json';
  const LOCAL_KEY = 'himmah_data';

  // Fungsi untuk mengisi state dari data (digunakan berulang)
  const applyData = (data) => {
    setBerita(data.berita || defaultBerita);
    setDivisi(data.divisi || defaultDivisi);
    setPengurus(data.pengurus || defaultPengurus);
    setBannerImages(data.bannerImages || []);
    setLogo(data.logo || null);
    setIsLoggedIn(data.isLoggedIn || false);
  };

  useEffect(() => {
    const loadData = async () => {
      // 1. Prioritas utama: localStorage
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          applyData(parsed);
          setDataLoaded(true);
          // Latar belakang: sinkronkan dari Blob hanya jika localStorage kosong? 
          // Kita bisa perbarui localStorage dengan data terbaru dari Blob secara diam-diam.
          // Tapi jangan menimpa state lagi, cukup perbarui localStorage jika Blob lebih baru.
          // Untuk memastikan Blob tetap sinkron, kita akan fetch Blob dan bandingkan.
          // Jika Blob berbeda, perbarui localStorage (tapi jangan reset state agar UI tidak berubah tiba-tiba).
          fetchBlobAndUpdateLocalSilently(parsed);
        } catch (e) {
          console.warn('Gagal parse localStorage, lanjut ke Blob');
          fetchBlobAsMain();
        }
      } else {
        // 2. Jika localStorage kosong, ambil dari Blob
        await fetchBlobAsMain();
      }
    };

    const fetchBlobAsMain = async () => {
      try {
        const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          applyData(json);
          // Simpan ke localStorage agar selanjutnya langsung dipakai
          localStorage.setItem(LOCAL_KEY, JSON.stringify(json));
        }
      } catch (err) {
        console.warn('Gagal fetch Blob, gunakan default');
      }
      setDataLoaded(true);
    };

    const fetchBlobAndUpdateLocalSilently = async (currentLocal) => {
      try {
        const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          // Jika Blob berbeda dengan localStorage, perbarui localStorage saja
          if (JSON.stringify(json) !== JSON.stringify(currentLocal)) {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(json));
            // Opsional: bisa juga update state, tapi jangan saat user sedang aktif
            // Kita bisa meminta konfirmasi atau langsung update diam-diam.
            // Untuk amannya, kita update state juga agar data terbaru tampil.
            applyData(json);
          }
        }
      } catch (err) {
        // silent
      }
    };

    loadData();
  }, []);

  // Simpan data ke localStorage dan kirim ke Blob (background)
  const saveAllData = async (newData) => {
    // 1. Simpan ke localStorage (prioritas utama)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newData));
    // 2. Kirim ke API untuk perbarui Blob (tidak menghalangi UI)
    try {
      await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      console.log('Data tersimpan ke Blob');
    } catch (err) {
      console.error('Gagal menyimpan ke Blob (data tetap aman di localStorage):', err);
    }
  };

  // Wrapper fungsi save – update state & panggil saveAllData
  const saveBerita = (data) => {
    setBerita(data);
    saveAllData({ berita: data, divisi, pengurus, bannerImages, logo, isLoggedIn });
  };

  const saveDivisi = (data) => {
    setDivisi(data);
    saveAllData({ berita, divisi: data, pengurus, bannerImages, logo, isLoggedIn });
  };

  const savePengurus = (data) => {
    setPengurus(data);
    saveAllData({ berita, divisi, pengurus: data, bannerImages, logo, isLoggedIn });
  };

  const saveBanner = (data) => {
    setBannerImages(data);
    saveAllData({ berita, divisi, pengurus, bannerImages: data, logo, isLoggedIn });
  };

  const saveLogo = (url) => {
    setLogo(url);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo: url, isLoggedIn });
  };

  const login = () => {
    setIsLoggedIn(true);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, isLoggedIn: true });
  };

  const logout = () => {
    setIsLoggedIn(false);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, isLoggedIn: false });
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004d24]">
        <p className="text-white text-lg">Memuat data...</p>
      </div>
    );
  }

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