import { createContext, useContext, useState, useEffect } from 'react';

// Data default (fallback)
const defaultPengurus = {
  ketua: { nama: 'Ketua', foto: '/img/ketua.jpg', },
  sekretaris: { nama: 'Sekretaris', foto: '/img/sekretaris.jpg', },
  bendahara: { nama: 'Bendahara', foto: '/img/bendahara.jpg',},
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
    kategori: 'Sosial',
    paragraf: [
      { judulParagraf: 'Pembukaan', isiParagraf: 'Kegiatan bakti sosial yang diadakan oleh HIMMAH NW Komisariat STMIK berlangsung sukses di Desa Sembalun. Puluhan mahasiswa turun langsung membantu masyarakat...' },
      { judulParagraf: 'Rangkaian Acara', isiParagraf: 'Acara dimulai dengan apel pagi, kemudian pembagian sembako, pengobatan gratis, dan diakhiri dengan ramah tamah bersama warga.' }
    ]
  },
  {
    id: 2, judul: 'Seminar Nasional Teknologi 4.0 Bersama Pakar IT',
    tanggal: '2024-11-25', foto: '/img/banner2.jpg',
    kategori: 'Pendidikan',
    paragraf: [{ judulParagraf: 'Pembukaan', isiParagraf: 'Bertempat di Aula Kampus STMIK, seminar nasional ini menghadirkan pakar IT dari berbagai instansi...' }]
  },
  {
    id: 3, judul: 'Pelantikan Pengurus Baru HIMMAH NW Periode 2024-2025',
    tanggal: '2024-11-01', foto: '/img/banner3.jpg',
    kategori: 'Organisasi',
    paragraf: [{ judulParagraf: 'Prosesi Pelantikan', isiParagraf: 'Prosesi pelantikan pengurus baru berjalan khidmat, dihadiri oleh jajaran dewan pembina dan seluruh anggota...' }]
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

  const applyData = (data) => {
    setBerita(data.berita || defaultBerita);
    setDivisi(data.divisi || defaultDivisi);
    setPengurus(data.pengurus || defaultPengurus);
    setBannerImages(data.bannerImages || []);
    setLogo(data.logo || null);
    // isLoggedIn TIDAK diambil dari data yang disimpan
  };

  useEffect(() => {
    // 1. Cek flag login DULUAN sebelum load data
    const loginFlag = localStorage.getItem('himmah_login');
    if (loginFlag === 'true') {
      setIsLoggedIn(true);
    }

    const loadData = async () => {
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          applyData(parsed);
          setDataLoaded(true);
          fetchBlobAndUpdateLocal(parsed);
        } catch (e) {
          console.warn('Gagal parse localStorage, lanjut ke Blob');
          await fetchBlobAsMain();
        }
      } else {
        await fetchBlobAsMain();
      }
    };

    const fetchBlobAsMain = async () => {
      try {
        const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.berita) {
            json.berita = json.berita.map(b => {
              if (!b.paragraf && b.redaksi) {
                return { ...b, paragraf: [{ judulParagraf: '', isiParagraf: b.redaksi }] };
              }
              return b;
            });
          }
          applyData(json);
          localStorage.setItem(LOCAL_KEY, JSON.stringify(json));
        }
      } catch (err) {
        console.warn('Gagal fetch Blob, gunakan default');
      }
      setDataLoaded(true);
    };

    const fetchBlobAndUpdateLocal = async (currentLocal) => {
      try {
        const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.berita) {
            json.berita = json.berita.map(b => {
              if (!b.paragraf && b.redaksi) {
                return { ...b, paragraf: [{ judulParagraf: '', isiParagraf: b.redaksi }] };
              }
              return b;
            });
          }
          if (JSON.stringify(json) !== JSON.stringify(currentLocal)) {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(json));
            applyData(json);
          }
        }
      } catch (err) {}
    };

    loadData();
  }, []);

  const saveAllData = async (data) => {
    const { isLoggedIn: _, ...dataToSave } = data; // selalu hapus isLoggedIn dari data yang disimpan
    localStorage.setItem(LOCAL_KEY, JSON.stringify(dataToSave));
    try {
      await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
    } catch (err) {
      console.error('Gagal menyimpan ke Blob:', err);
    }
  };

  const saveBerita = (data) => {
    setBerita(data);
    saveAllData({ berita: data, divisi, pengurus, bannerImages, logo });
  };
  const saveDivisi = (data) => {
    setDivisi(data);
    saveAllData({ berita, divisi: data, pengurus, bannerImages, logo });
  };
  const savePengurus = (data) => {
    setPengurus(data);
    saveAllData({ berita, divisi, pengurus: data, bannerImages, logo });
  };
  const saveBanner = (data) => {
    setBannerImages(data);
    saveAllData({ berita, divisi, pengurus, bannerImages: data, logo });
  };
  const saveLogo = (url) => {
    setLogo(url);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo: url });
  };

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('himmah_login', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('himmah_login');
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