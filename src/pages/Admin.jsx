import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { adminAccounts } from '../data/config';
import {
  LogOut, Plus, Trash2, Edit3, Save, X, Check
} from 'lucide-react';

// API Key ImgBB dari environment variable
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

// Konversi file ke base64 (dibutuhkan ImgBB)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Upload gambar ke ImgBB
async function uploadImage(file) {
  if (!IMGBB_API_KEY) throw new Error('API Key ImgBB tidak ditemukan');

  const base64 = await fileToBase64(file);
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', base64);
  formData.append('name', file.name);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error?.message || 'Upload gagal');
  }

  return result.data.url; // URL publik gambar
}

// Fungsi hapus (ImgBB tidak mendukung hapus via API, biarkan kosong)
async function deleteImage(url) {
  // Tidak bisa hapus dari ImgBB, abaikan saja
  console.warn('Penghapusan gambar tidak didukung di ImgBB');
}

export default function Admin() {
  const {
    isLoggedIn, login, logout,
    berita, saveBerita,
    divisi, saveDivisi,
    bannerImages, saveBanner,
    logo, saveLogo,
  } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('berita');
  const [isUploading, setIsUploading] = useState(false);

  // --- Berita form ---
  const [beritaForm, setBeritaForm] = useState({
    judul: '', redaksi: '', tanggal: '', kategori: '', fotoFile: null
  });
  const [editBeritaId, setEditBeritaId] = useState(null);
  const fileBeritaRef = useRef(null);

  // --- Divisi form ---
  const [divisiForm, setDivisiForm] = useState({ nama: '', programKerja: '', anggota: '' });
  const [editDivisiId, setEditDivisiId] = useState(null);

  // --- Banner form ---
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerAlt, setBannerAlt] = useState('');

  // --- Logo ---
  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const found = adminAccounts.find(a => a.username === username && a.password === password);
    if (found) {
      login();
      setLoginError('');
    } else {
      setLoginError('Username atau password salah!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass p-8 rounded-2xl w-full max-w-md">
          <h2 className="text-2xl font-playfair font-bold text-white text-center mb-6">Login Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-green-300 text-sm">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                placeholder="Masukkan username" required />
            </div>
            <div>
              <label className="text-green-300 text-sm">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                placeholder="Masukkan password" required />
            </div>
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors">
              Masuk
            </button>
          </form>
          <p className="text-green-400/50 text-xs text-center mt-4">Akun admin diatur di file config.js</p>
        </div>
      </div>
    );
  }

  // ============== BERITA ==============
  const handleBeritaSubmit = async (e) => {
    e.preventDefault();
    if (!beritaForm.judul || !beritaForm.redaksi) return;

    let fotoUrl = '';
    if (beritaForm.fotoFile) {
      setIsUploading(true);
      try {
        fotoUrl = await uploadImage(beritaForm.fotoFile);
      } catch (err) {
        alert('Gagal upload foto: ' + err.message);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    } else if (editBeritaId) {
      const existing = berita.find(b => b.id === editBeritaId);
      fotoUrl = existing?.foto || '';
    }

    const newBerita = {
      id: editBeritaId || Date.now(),
      judul: beritaForm.judul,
      redaksi: beritaForm.redaksi,
      tanggal: beritaForm.tanggal || new Date().toISOString().slice(0, 10),
      kategori: beritaForm.kategori,
      foto: fotoUrl,
    };

    if (editBeritaId) {
      saveBerita(berita.map(b => b.id === editBeritaId ? newBerita : b));
      setEditBeritaId(null);
    } else {
      saveBerita([newBerita, ...berita]);
    }

    setBeritaForm({ judul: '', redaksi: '', tanggal: '', kategori: '', fotoFile: null });
    if (fileBeritaRef.current) fileBeritaRef.current.value = '';
  };

  const handleEditBerita = (item) => {
    setBeritaForm({
      judul: item.judul,
      redaksi: item.redaksi,
      tanggal: item.tanggal,
      kategori: item.kategori || '',
      fotoFile: null,
    });
    setEditBeritaId(item.id);
    setActiveTab('berita');
  };

  const handleDeleteBerita = async (id) => {
    // Tidak perlu hapus dari ImgBB
    saveBerita(berita.filter(b => b.id !== id));
  };

  // ============== DIVISI ==============
  const handleDivisiSubmit = (e) => {
    e.preventDefault();
    const newDivisi = {
      id: editDivisiId || Date.now(),
      nama: divisiForm.nama,
      programKerja: divisiForm.programKerja.split('\n').filter(Boolean),
      anggota: divisiForm.anggota.split('\n').filter(Boolean),
    };
    if (editDivisiId) {
      saveDivisi(divisi.map(d => d.id === editDivisiId ? newDivisi : d));
      setEditDivisiId(null);
    } else {
      saveDivisi([...divisi, newDivisi]);
    }
    setDivisiForm({ nama: '', programKerja: '', anggota: '' });
  };

  const handleEditDivisi = (item) => {
    setDivisiForm({
      nama: item.nama,
      programKerja: item.programKerja.join('\n'),
      anggota: item.anggota.join('\n'),
    });
    setEditDivisiId(item.id);
    setActiveTab('divisi');
  };

  const handleDeleteDivisi = (id) => {
    if (window.confirm('Yakin ingin menghapus divisi ini?')) {
      saveDivisi(divisi.filter(d => d.id !== id));
    }
  };

  // ============== BANNER ==============
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerFile) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(bannerFile);
      const newBanner = { id: Date.now(), src: imageUrl, alt: bannerAlt };
      saveBanner([...bannerImages, newBanner]);
      setBannerFile(null);
      setBannerAlt('');
    } catch (err) {
      alert('Upload banner gagal: ' + err.message);
    }
    setIsUploading(false);
  };

  const handleDeleteBanner = async (id) => {
    saveBanner(bannerImages.filter(b => b.id !== id));
  };

  // ============== LOGO ==============
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = async () => {
    if (!logoFile) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(logoFile);
      saveLogo(imageUrl);
      setLogoFile(null);
      setPreviewLogo(null);
      alert('Logo berhasil diperbarui!');
    } catch (err) {
      alert('Upload logo gagal: ' + err.message);
    }
    setIsUploading(false);
  };

  const handleResetLogo = async () => {
    if (window.confirm('Reset logo ke default? Logo yang terupload akan hilang dari tampilan.')) {
      saveLogo(null);
      setPreviewLogo(null);
      setLogoFile(null);
    }
  };

  const tabs = [
    { key: 'berita', label: '📰 Berita' },
    { key: 'divisi', label: '👥 Divisi' },
    { key: 'banner', label: '🖼️ Banner' },
    { key: 'logo', label: '🏷️ Logo' },
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">Panel Admin</h1>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Tabs */}
        <div className="glass p-1.5 rounded-2xl flex gap-1 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-green-500 text-white shadow-lg' : 'text-green-300 hover:bg-white/10'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* BERITA TAB */}
        {activeTab === 'berita' && (
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-white font-bold text-lg mb-4">
                {editBeritaId ? '✏️ Edit Berita' : '➕ Tambah Berita Baru'}
              </h2>
              <form onSubmit={handleBeritaSubmit} className="space-y-4">
                <input type="text" placeholder="Judul Berita" value={beritaForm.judul}
                  onChange={(e) => setBeritaForm({ ...beritaForm, judul: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" required />
                <textarea placeholder="Redaksi Berita" value={beritaForm.redaksi}
                  onChange={(e) => setBeritaForm({ ...beritaForm, redaksi: e.target.value })}
                  rows="4" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400 resize-none" required />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="date" value={beritaForm.tanggal}
                    onChange={(e) => setBeritaForm({ ...beritaForm, tanggal: e.target.value })}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400" />
                  <input type="text" placeholder="Kategori" value={beritaForm.kategori}
                    onChange={(e) => setBeritaForm({ ...beritaForm, kategori: e.target.value })}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" />
                  <div className="relative">
                    <input type="file" accept="image/*" ref={fileBeritaRef}
                      onChange={(e) => setBeritaForm({ ...beritaForm, fotoFile: e.target.files[0] })}
                      className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white" />
                    {editBeritaId && !beritaForm.fotoFile && (
                      <p className="text-green-300/60 text-xs mt-1">Biarkan kosong jika tidak ingin mengubah foto</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={isUploading}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50">
                    {isUploading ? 'Mengunggah...' : <><Save size={16} /> {editBeritaId ? 'Update' : 'Simpan'}</>}
                  </button>
                  {editBeritaId && (
                    <button type="button" onClick={() => { setEditBeritaId(null); setBeritaForm({ judul: '', redaksi: '', tanggal: '', kategori: '', fotoFile: null }); }}
                      className="px-6 py-3 bg-gray-500/30 text-white rounded-xl hover:bg-gray-500/50 transition-colors flex items-center gap-2">
                      <X size={16} /> Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h2 className="text-white font-bold text-lg mb-4">📋 Daftar Berita ({berita.length})</h2>
              {berita.length === 0 ? <p className="text-green-300/50">Belum ada berita.</p> : (
                <div className="space-y-3">
                  {berita.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        {item.foto && <img src={item.foto} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" onError={(e) => e.target.style.display='none'} />}
                        <div>
                          <p className="text-white font-medium text-sm line-clamp-1">{item.judul}</p>
                          <p className="text-green-300/60 text-xs">{item.tanggal}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button onClick={() => handleEditBerita(item)} className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteBerita(item.id)} className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DIVISI TAB */}
        {activeTab === 'divisi' && (
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-white font-bold text-lg mb-4">
                {editDivisiId ? '✏️ Edit Divisi' : '➕ Tambah Divisi Baru'}
              </h2>
              <form onSubmit={handleDivisiSubmit} className="space-y-4">
                <input type="text" placeholder="Nama Divisi" value={divisiForm.nama}
                  onChange={(e) => setDivisiForm({ ...divisiForm, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" required />
                <textarea placeholder="Program Kerja (satu per baris)" value={divisiForm.programKerja}
                  onChange={(e) => setDivisiForm({ ...divisiForm, programKerja: e.target.value })}
                  rows="3" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400 resize-none" required />
                <textarea placeholder="Anggota (satu per baris, Kadiv di paling atas)" value={divisiForm.anggota}
                  onChange={(e) => setDivisiForm({ ...divisiForm, anggota: e.target.value })}
                  rows="3" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400 resize-none" required />
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                    <Save size={16} /> {editDivisiId ? 'Update' : 'Simpan'}
                  </button>
                  {editDivisiId && (
                    <button type="button" onClick={() => { setEditDivisiId(null); setDivisiForm({ nama: '', programKerja: '', anggota: '' }); }}
                      className="px-6 py-3 bg-gray-500/30 text-white rounded-xl hover:bg-gray-500/50 transition-colors flex items-center gap-2">
                      <X size={16} /> Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h2 className="text-white font-bold text-lg mb-4">📋 Daftar Divisi ({divisi.length})</h2>
              {divisi.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl mb-2">
                  <div>
                    <p className="text-white font-medium">{item.nama}</p>
                    <p className="text-green-300/60 text-xs">{item.anggota.length} anggota · {item.programKerja.length} proker</p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button onClick={() => handleEditDivisi(item)} className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30"><Edit3 size={14} /></button>
                    <button onClick={() => handleDeleteDivisi(item.id)} className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BANNER TAB */}
        {activeTab === 'banner' && (
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-white font-bold text-lg mb-4">➕ Tambah Banner</h2>
              <form onSubmit={handleBannerSubmit} className="space-y-4">
                <div>
                  <label className="text-green-300 text-sm block mb-1">File Gambar</label>
                  <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])}
                    className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white" required />
                </div>
                <input type="text" placeholder="Deskripsi Banner" value={bannerAlt} onChange={(e) => setBannerAlt(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" required />
                <button type="submit" disabled={isUploading}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isUploading ? 'Mengunggah...' : <><Plus size={16} /> Tambah Banner</>}
                </button>
              </form>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h2 className="text-white font-bold text-lg mb-4">🖼️ Banner Aktif ({bannerImages.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bannerImages.map(banner => (
                  <div key={banner.id} className="relative bg-white/5 rounded-xl overflow-hidden group">
                    <img src={banner.src} alt={banner.alt} className="w-full h-40 object-cover"
                      onError={(e) => e.target.src = 'https://placehold.co/400x200/333/fff?text=Error'} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => handleDeleteBanner(banner.id)}
                        className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600"><Trash2 size={18} /></button>
                    </div>
                    <p className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">{banner.alt}</p>
                  </div>
                ))}
                {bannerImages.length === 0 && <p className="text-green-300/50 col-span-2 text-center py-8">Belum ada banner custom. Banner default akan ditampilkan.</p>}
              </div>
            </div>
          </div>
        )}

        {/* LOGO TAB */}
        {activeTab === 'logo' && (
          <div className="glass p-6 rounded-2xl space-y-6">
            <h2 className="text-white font-bold text-lg">🏷️ Pengaturan Logo</h2>
            <p className="text-green-300/60 text-sm">Logo akan muncul di navbar dan header beranda.</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="text-center">
                <p className="text-green-300 text-sm mb-2">Logo Saat Ini:</p>
                <img src={logo || '/img/logo.png'} alt="Logo"
                  className="w-24 h-24 object-contain rounded-full border-2 border-green-400/30 bg-white/5"
                  onError={(e) => e.target.src = '/img/logo.png'} />
              </div>
              <div className="flex-1">
                <label className="block text-green-300 text-sm mb-2">Upload Logo Baru (PNG/JPG):</label>
                <input type="file" accept="image/*" onChange={handleLogoChange}
                  className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white" />
                {previewLogo && (
                  <div className="mt-3 flex items-center gap-4">
                    <img src={previewLogo} alt="Preview" className="w-16 h-16 object-contain rounded-lg border border-green-400/30" />
                    <div className="flex gap-2">
                      <button onClick={handleSaveLogo} disabled={isUploading}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center gap-2 text-sm disabled:opacity-50">
                        {isUploading ? 'Menyimpan...' : <><Check size={16} /> Simpan Logo</>}
                      </button>
                      <button onClick={() => { setPreviewLogo(null); setLogoFile(null); }}
                        className="px-4 py-2 bg-gray-500/30 text-white rounded-xl hover:bg-gray-500/50 text-sm">Batal</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <button onClick={handleResetLogo}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 flex items-center gap-2 text-sm">
                <Trash2 size={16} /> Reset ke Logo Default
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}