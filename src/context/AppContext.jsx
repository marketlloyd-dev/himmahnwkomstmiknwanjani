import { createContext, useContext, useState, useEffect } from 'react';

const defaultPengurus = {
  ketua: { nama: 'Ketua', foto: '/img/ketua.jpg', nim: '-', jurusan: '-', angkatan: '-' },
  sekretaris: { nama: 'Sekretaris', foto: '/img/sekretaris.jpg', nim: '-', jurusan: '-', angkatan: '-' },
  bendahara: { nama: 'Bendahara', foto: '/img/bendahara.jpg', nim: '-', jurusan: '-', angkatan: '-' },
};

const defaultDivisi = [
  {
    id: 1,
    nama: 'Divisi Dakwah & Keagamaan',
    programKerja: ['Pengajian Rutin Mingguan', 'Peringatan Hari Besar Islam', 'Kajian Kitab Kuning', 'Pelatihan Tilawah & Tartil'],
    anggota: [
      { nama: 'Muhammad Ali', jabatan: 'Kadiv', foto: '' },
      { nama: 'Hasan Basri', jabatan: 'Anggota', foto: '' },
      { nama: "Ahmad Syafi'i", jabatan: 'Anggota', foto: '' },
      { nama: 'Zainuddin', jabatan: 'Anggota', foto: '' },
    ],
  },
  {
    id: 2,
    nama: 'Divisi Pendidikan & Pelatihan',
    programKerja: ['Seminar Teknologi', 'Workshop Programming', 'Pelatihan Desain Grafis', 'Study Club'],
    anggota: [
      { nama: 'Baiq Dewi', jabatan: 'Kadiv', foto: '' },
      { nama: 'Lalu Rahman', jabatan: 'Anggota', foto: '' },
      { nama: 'Rizki Maulana', jabatan: 'Anggota', foto: '' },
      { nama: 'Fitriani', jabatan: 'Anggota', foto: '' },
    ],
  },
  {
    id: 3,
    nama: 'Divisi Sosial & Kemasyarakatan',
    programKerja: ['Bakti Sosial', 'Santunan Anak Yatim', 'Bersih Lingkungan', 'Donor Darah'],
    anggota: [
      { nama: 'Abdul Hamid', jabatan: 'Kadiv', foto: '' },
      { nama: 'Nurul Hidayah', jabatan: 'Anggota', foto: '' },
      { nama: 'Samsul Arifin', jabatan: 'Anggota', foto: '' },
      { nama: 'Rina Agustina', jabatan: 'Anggota', foto: '' },
    ],
  },
  {
    id: 4,
    nama: 'Divisi Minat & Bakat',
    programKerja: ['Futsal Competition', 'Pentas Seni', 'Lomba Debat', 'Pelatihan Public Speaking'],
    anggota: [
      { nama: 'Fajar Ramadhan', jabatan: 'Kadiv', foto: '' },
      { nama: 'Baiq Aulia', jabatan: 'Anggota', foto: '' },
      { nama: 'Dimas Saputra', jabatan: 'Anggota', foto: '' },
      { nama: 'Maya Sari', jabatan: 'Anggota', foto: '' },
    ],
  },
];

const defaultBerita = [
  {
    id: 1, judul: 'HIMMAH NW STMIK Gelar Bakti Sosial di Desa Sembalun',
    tanggal: '2024-12-10', foto: '/img/banner1.jpg',
    kategori: 'Sosial',
    paragraf: [
      { judulParagraf: 'Pembukaan', isiParagraf: 'Kegiatan bakti sosial...' },
      { judulParagraf: 'Rangkaian Acara', isiParagraf: 'Acara dimulai dengan apel pagi...' }
    ]
  },
  {
    id: 2, judul: 'Seminar Nasional Teknologi 4.0 Bersama Pakar IT',
    tanggal: '2024-11-25', foto: '/img/banner2.jpg',
    kategori: 'Pendidikan',
    paragraf: [{ judulParagraf: 'Pembukaan', isiParagraf: 'Bertempat di Aula Kampus STMIK...' }]
  },
  {
    id: 3, judul: 'Pelantikan Pengurus Baru HIMMAH NW Periode 2024-2025',
    tanggal: '2024-11-01', foto: '/img/banner3.jpg',
    kategori: 'Organisasi',
    paragraf: [{ judulParagraf: 'Prosesi Pelantikan', isiParagraf: 'Prosesi pelantikan pengurus baru...' }]
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
  const [komentar, setKomentar] = useState({});
  const [likes, setLikes] = useState({});
  const [countdownEvent, setCountdownEvent] = useState(null);
  const [poll, setPoll] = useState(null);
  const [anggotaList, setAnggotaList] = useState([]);
  const [beritaInternal, setBeritaInternal] = useState([]);
  const [inviteCode, setInviteCode] = useState('HIMMAH2024');
  const [dataLoaded, setDataLoaded] = useState(false);

  const DATA_BLOB_URL = 'https://trwurgahpjquoqvn.public.blob.vercel-storage.com/data.json';
  const LOCAL_KEY = 'himmah_data';

  const applyData = (data) => {
    setBerita(data.berita || defaultBerita);
    setDivisi(data.divisi || defaultDivisi);
    setPengurus(data.pengurus || defaultPengurus);
    setBannerImages(data.bannerImages || []);
    setLogo(data.logo || null);
    setKomentar(data.komentar || {});
    setLikes(data.likes || {});
    if (data.countdownEvent) setCountdownEvent(data.countdownEvent);
    if (data.poll) setPoll(data.poll);
    setAnggotaList(data.anggotaList || []);
    setBeritaInternal(data.beritaInternal || []);
    setInviteCode(data.inviteCode || 'HIMMAH2024');
  };

  useEffect(() => {
    const loginFlag = localStorage.getItem('himmah_login');
    if (loginFlag === 'true') setIsLoggedIn(true);

    const loadData = async () => {
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          applyData(parsed);
          setDataLoaded(true);
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
          applyData(json);
          localStorage.setItem(LOCAL_KEY, JSON.stringify(json));
        }
      } catch (err) {
        console.warn('Gagal fetch Blob, gunakan default');
      }
      setDataLoaded(true);
    };

    loadData();
  }, []);

  const saveAllData = async (data) => {
    const { isLoggedIn: _, ...dataToSave } = data;
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
    saveAllData({ berita: data, divisi, pengurus, bannerImages, logo, komentar, likes, countdownEvent, poll, anggotaList, beritaInternal, inviteCode });
  };
  const saveDivisi = (data) => {
    setDivisi(data);
    saveAllData({ berita, divisi: data, pengurus, bannerImages, logo, komentar, likes, countdownEvent, poll, anggotaList, beritaInternal, inviteCode });
  };
  const savePengurus = (data) => {
    setPengurus(data);
    saveAllData({ berita, divisi, pengurus: data, bannerImages, logo, komentar, likes, countdownEvent, poll, anggotaList, beritaInternal, inviteCode });
  };
  const saveBanner = (data) => {
    setBannerImages(data);
    saveAllData({ berita, divisi, pengurus, bannerImages: data, logo, komentar, likes, countdownEvent, poll, anggotaList, beritaInternal, inviteCode });
  };
  const saveLogo = (url) => {
    setLogo(url);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo: url, komentar, likes, countdownEvent, poll, anggotaList, beritaInternal, inviteCode });
  };
  const saveKomentarBaru = (beritaId, data, replace = false) => {
    const updatedKomentar = { ...komentar, [beritaId]: replace ? data : [...(komentar[beritaId] || []), data] };
    setKomentar(updatedKomentar);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar: updatedKomentar, likes, countdownEvent, poll, anggotaList, beritaInternal, inviteCode });
  };
  const toggleLike = (beritaId) => {
    const updated = { ...likes, [beritaId]: (likes[beritaId] || 0) + 1 };
    setLikes(updated);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar, likes: updated, countdownEvent, poll, anggotaList, beritaInternal, inviteCode });
  };
  const saveCountdownEvent = (event) => {
    setCountdownEvent(event);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar, likes, countdownEvent: event, poll, anggotaList, beritaInternal, inviteCode });
  };
  const removeCountdownEvent = () => {
    setCountdownEvent(null);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar, likes, countdownEvent: null, poll, anggotaList, beritaInternal, inviteCode });
  };
  const savePoll = (newPoll) => {
    setPoll(newPoll);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar, likes, countdownEvent, poll: newPoll, anggotaList, beritaInternal, inviteCode });
  };
  const removePoll = () => {
    setPoll(null);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar, likes, countdownEvent, poll: null, anggotaList, beritaInternal, inviteCode });
  };
  const saveAnggotaList = (data) => {
    setAnggotaList(data);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar, likes, countdownEvent, poll, anggotaList: data, beritaInternal, inviteCode });
  };
  const saveBeritaInternal = (data) => {
    setBeritaInternal(data);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar, likes, countdownEvent, poll, anggotaList, beritaInternal: data, inviteCode });
  };
  const saveInviteCode = (code) => {
    setInviteCode(code);
    saveAllData({ berita, divisi, pengurus, bannerImages, logo, komentar, likes, countdownEvent, poll, anggotaList, beritaInternal, inviteCode: code });
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
        komentar, saveKomentarBaru,
        likes, toggleLike,
        countdownEvent, saveCountdownEvent, removeCountdownEvent,
        poll, savePoll, removePoll,
        anggotaList, saveAnggotaList,
        beritaInternal, saveBeritaInternal,
        inviteCode, saveInviteCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);