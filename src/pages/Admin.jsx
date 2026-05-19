import { useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { adminAccounts, dataKomisariat } from '../data/config';
import {
  LogOut, Plus, Trash2, Edit3, Save, X, Check, Crop as CropIcon,
  Newspaper, Users, Image, Palette, User, TrendingUp, Calendar,
  Tag, Bold, Italic, Underline, Strikethrough, Link, Quote,
  Heading1, Heading2, List, ListOrdered, ImagePlus, Search,
  BookOpen, Shield, Menu, Clock, BarChart3, Key
} from 'lucide-react';
import SEO from '../components/SEO';
import CropModal from '../components/CropModal';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
  if (!result.success) throw new Error(result.error?.message || 'Upload gagal');
  return result.data.url;
}

function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const imageInputRef = useRef(null);
  const isInternalChange = useRef(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    h2: false,
    h3: false,
    blockquote: false,
    unorderedList: false,
    orderedList: false,
  });

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !editorRef.current.contains(sel.anchorNode)) {
      setActiveFormats({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        h2: false,
        h3: false,
        blockquote: false,
        unorderedList: false,
        orderedList: false,
      });
      return;
    }
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      h2:
        document.queryCommandState('formatBlock') &&
        document.queryCommandValue('formatBlock') === 'h2',
      h3:
        document.queryCommandState('formatBlock') &&
        document.queryCommandValue('formatBlock') === 'h3',
      blockquote:
        document.queryCommandState('formatBlock') &&
        document.queryCommandValue('formatBlock') === 'blockquote',
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    });
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    document.addEventListener('selectionchange', updateActiveFormats);
    return () => document.removeEventListener('selectionchange', updateActiveFormats);
  }, [updateActiveFormats]);

  const execCommand = useCallback(
    (command, val = null) => {
      editorRef.current?.focus();
      if (command === 'heading') {
        document.execCommand('heading', false, val);
        if (!document.queryCommandState('heading')) {
          document.execCommand('formatBlock', false, `<${val}>`);
        }
      } else if (command === 'formatBlock') {
        document.execCommand('formatBlock', false, val);
      } else {
        document.execCommand(command, false, val);
      }
      if (editorRef.current) {
        isInternalChange.current = true;
        onChange(editorRef.current.innerHTML);
      }
      setTimeout(() => updateActiveFormats(), 10);
    },
    [onChange, updateActiveFormats]
  );

  const handleInsertLink = () => {
    if (linkUrl.trim()) {
      document.execCommand('createLink', false, linkUrl.trim());
      if (editorRef.current) {
        isInternalChange.current = true;
        onChange(editorRef.current.innerHTML);
      }
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      execCommand('insertImage', url);
    } catch (err) {
      alert('Gagal upload gambar: ' + err.message);
    }
  };

  const btnBase = 'p-2 rounded transition-colors';
  const btnInactive = 'hover:bg-gray-200 text-gray-600';
  const btnActive = 'bg-green-200 text-green-800 hover:bg-green-300';

  return (
    <div className="border border-white/20 rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b">
        <button type="button" onClick={() => execCommand('bold')} className={`${btnBase} ${activeFormats.bold ? btnActive : btnInactive}`} title="Tebal"><Bold size={16} /></button>
        <button type="button" onClick={() => execCommand('italic')} className={`${btnBase} ${activeFormats.italic ? btnActive : btnInactive}`} title="Miring"><Italic size={16} /></button>
        <button type="button" onClick={() => execCommand('underline')} className={`${btnBase} ${activeFormats.underline ? btnActive : btnInactive}`} title="Garis Bawah"><Underline size={16} /></button>
        <button type="button" onClick={() => execCommand('strikeThrough')} className={`${btnBase} ${activeFormats.strikeThrough ? btnActive : btnInactive}`} title="Coret"><Strikethrough size={16} /></button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('heading', 'h2')} className={`${btnBase} ${activeFormats.h2 ? btnActive : btnInactive}`} title="Heading 1"><Heading1 size={16} /></button>
        <button type="button" onClick={() => execCommand('heading', 'h3')} className={`${btnBase} ${activeFormats.h3 ? btnActive : btnInactive}`} title="Heading 2"><Heading2 size={16} /></button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className={`${btnBase} ${activeFormats.unorderedList ? btnActive : btnInactive}`} title="List"><List size={16} /></button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className={`${btnBase} ${activeFormats.orderedList ? btnActive : btnInactive}`} title="List Bernomor"><ListOrdered size={16} /></button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('formatBlock', '<blockquote>')} className={`${btnBase} ${activeFormats.blockquote ? btnActive : btnInactive}`} title="Quote"><Quote size={16} /></button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button type="button" onClick={() => setShowLinkInput(!showLinkInput)} className={`${btnBase} hover:bg-gray-200 text-gray-600`} title="Tautan"><Link size={16} /></button>
        <button type="button" onClick={() => imageInputRef.current?.click()} className={`${btnBase} hover:bg-gray-200 text-gray-600`} title="Gambar"><ImagePlus size={16} /></button>
        <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
        {showLinkInput && (
          <div className="flex items-center gap-1 ml-2">
            <input type="url" placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="px-2 py-1 text-sm border rounded w-40" />
            <button type="button" onClick={handleInsertLink} className="px-2 py-1 bg-green-500 text-white text-xs rounded">OK</button>
          </div>
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        dir="ltr"
        className="min-h-[300px] p-4 text-gray-800 focus:outline-none"
        style={{ direction: 'ltr', textAlign: 'left' }}
        onInput={() => {
          if (editorRef.current) {
            isInternalChange.current = true;
            onChange(editorRef.current.innerHTML);
          }
          setTimeout(() => updateActiveFormats(), 10);
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
        data-placeholder={placeholder || 'Tulis konten berita...'}
      />
    </div>
  );
}

export default function Admin() {
  const {
    isLoggedIn, login, logout,
    berita, saveBerita,
    divisi, saveDivisi,
    bannerImages, saveBanner,
    logo, saveLogo,
    pengurus, savePengurus,
    countdownEvent, saveCountdownEvent, removeCountdownEvent,
    poll, savePoll, removePoll,
    anggotaList, saveAnggotaList,
    beritaInternal, saveBeritaInternal,
    inviteCode, saveInviteCode,
  } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUploading, setIsUploading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [cropModal, setCropModal] = useState({
    open: false,
    imageSrc: '',
    onCropComplete: null,
    aspect: 1,
    cropShape: 'rect',
  });

  const [beritaForm, setBeritaForm] = useState({
    judul: '', tanggal: '', kategori: '', fotoFile: null, kontenHTML: '',
  });
  const [editBeritaId, setEditBeritaId] = useState(null);
  const fileBeritaRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  const [divisiForm, setDivisiForm] = useState({
    nama: '', programKerja: '', anggota: [{ nama: '', jabatan: 'Anggota', foto: '' }],
  });
  const [editDivisiId, setEditDivisiId] = useState(null);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerAlt, setBannerAlt] = useState('');

  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [pengurusForm, setPengurusForm] = useState({
    ketua: { nama: '', fotoFile: null },
    sekretaris: { nama: '', fotoFile: null },
    bendahara: { nama: '', fotoFile: null },
  });
  const [previewPengurus, setPreviewPengurus] = useState({
    ketua: null, sekretaris: null, bendahara: null,
  });

  const [sejarahForm, setSejarahForm] = useState({
    tahunBerdiri: dataKomisariat.tahunBerdiri,
    deskripsi: dataKomisariat.deskripsi,
  });

  const [adminAccountsState, setAdminAccountsState] = useState(() => {
    const saved = localStorage.getItem('himmah_admin_accounts');
    return saved ? JSON.parse(saved) : adminAccounts;
  });
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });

  const [countdownForm, setCountdownForm] = useState({
    title: '', description: '', targetDate: '',
  });

  const [pollForm, setPollForm] = useState({
    question: '',
    options: [
      { text: '', votes: 0 },
      { text: '', votes: 0 },
    ],
  });

  const [anggotaForm, setAnggotaForm] = useState({
    nim: '', nama: '', password: '', jurusan: '', angkatan: '', divisi: '', foto: ''
  });
  const [editAnggotaNim, setEditAnggotaNim] = useState(null);

  const [beritaInternalForm, setBeritaInternalForm] = useState({
    judul: '', isi: '', tanggal: ''
  });
  const [editBeritaInternalId, setEditBeritaInternalId] = useState(null);

  const [inviteCodeForm, setInviteCodeForm] = useState(inviteCode);

  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('himmah_activity_log');
    return saved ? JSON.parse(saved) : [];
  });
  const logActivity = (action) => {
    const entry = {
      action,
      timestamp: new Date().toISOString(),
      user: username || 'Admin',
    };
    const updated = [entry, ...activityLog].slice(0, 100);
    setActivityLog(updated);
    localStorage.setItem('himmah_activity_log', JSON.stringify(updated));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const found = adminAccountsState.find(
      (a) => a.username === username && a.password === password
    );
    if (found) { login(); setLoginError(''); }
    else setLoginError('Username atau password salah!');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#002b13] to-[#004d24]">
        <div className="glass p-8 rounded-2xl w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <User size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-white">Panel Admin</h2>
          <p className="text-green-300/60 text-sm mt-1">HIMMAH NW Komisariat STMIK</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
            <div>
              <label className="text-green-300 text-sm font-medium">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                placeholder="Masukkan username" required />
            </div>
            <div>
              <label className="text-green-300 text-sm font-medium">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                placeholder="Masukkan password" required />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{loginError}</p>
            )}
            <button type="submit" className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors">
              Masuk ke Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleBeritaSubmit = async (e) => {
    e.preventDefault();
    if (!beritaForm.judul || !beritaForm.kontenHTML) return;
    let fotoUrl = '';
    if (beritaForm.fotoFile) {
      setIsUploading(true);
      try { fotoUrl = await uploadImage(beritaForm.fotoFile); } catch (err) {
        alert('Gagal upload foto: ' + err.message); setIsUploading(false); return;
      }
      setIsUploading(false);
    } else if (editBeritaId) {
      fotoUrl = berita.find(b => b.id === editBeritaId)?.foto || '';
    }
    const newBerita = {
      id: editBeritaId || Date.now(),
      judul: beritaForm.judul,
      tanggal: beritaForm.tanggal || new Date().toISOString().slice(0, 10),
      kategori: beritaForm.kategori,
      foto: fotoUrl,
      kontenHTML: beritaForm.kontenHTML,
    };
    if (editBeritaId) {
      saveBerita(berita.map(b => b.id === editBeritaId ? newBerita : b));
      setEditBeritaId(null);
      logActivity(`Mengedit berita "${newBerita.judul}"`);
    } else {
      saveBerita([newBerita, ...berita]);
      logActivity(`Menambah berita baru "${newBerita.judul}"`);
    }
    setBeritaForm({ judul: '', tanggal: '', kategori: '', fotoFile: null, kontenHTML: '' });
    if (fileBeritaRef.current) fileBeritaRef.current.value = '';
    localStorage.removeItem('himmah_berita_draft');
  };

  const handleEditBerita = (item) => {
    setBeritaForm({
      judul: item.judul || '', tanggal: item.tanggal || '', kategori: item.kategori || '',
      fotoFile: null, kontenHTML: item.kontenHTML || '',
    });
    setEditBeritaId(item.id);
    setActiveTab('berita');
  };

  const handleDeleteBerita = (id) => {
    const item = berita.find(b => b.id === id);
    if (window.confirm('Hapus berita ini?')) {
      saveBerita(berita.filter(b => b.id !== id));
      logActivity(`Menghapus berita "${item?.judul}"`);
    }
  };

  const filteredBerita = berita.filter(item => {
    const matchSearch = !searchQuery || item.judul.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = !filterKategori || (item.kategori || '').toLowerCase().includes(filterKategori.toLowerCase());
    const matchTanggal = !filterTanggal || item.tanggal === filterTanggal;
    return matchSearch && matchKategori && matchTanggal;
  });

  const handleDivisiSubmit = (e) => {
    e.preventDefault();
    const newDivisi = {
      id: editDivisiId || Date.now(),
      nama: divisiForm.nama,
      programKerja: divisiForm.programKerja.split('\n').filter(Boolean),
      anggota: divisiForm.anggota.filter(a => a.nama.trim() !== ''),
    };
    if (editDivisiId) {
      saveDivisi(divisi.map(d => d.id === editDivisiId ? newDivisi : d));
      setEditDivisiId(null);
      logActivity(`Mengedit divisi "${newDivisi.nama}"`);
    } else {
      saveDivisi([...divisi, newDivisi]);
      logActivity(`Menambah divisi "${newDivisi.nama}"`);
    }
    setDivisiForm({ nama: '', programKerja: '', anggota: [{ nama: '', jabatan: 'Anggota', foto: '' }] });
  };

  const handleEditDivisi = (item) => {
    setDivisiForm({
      nama: item.nama,
      programKerja: item.programKerja.join('\n'),
      anggota: item.anggota.length > 0 ? item.anggota : [{ nama: '', jabatan: 'Anggota', foto: '' }],
    });
    setEditDivisiId(item.id);
    setActiveTab('divisi');
  };

  const handleDeleteDivisi = (id) => {
    const item = divisi.find(d => d.id === id);
    if (window.confirm('Hapus divisi ini?')) {
      saveDivisi(divisi.filter(d => d.id !== id));
      logActivity(`Menghapus divisi "${item?.nama}"`);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerFile) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(bannerFile);
      saveBanner([...bannerImages, { id: Date.now(), src: imageUrl, alt: bannerAlt }]);
      setBannerFile(null); setBannerAlt('');
      logActivity('Menambah banner baru');
    } catch (err) { alert('Upload banner gagal: ' + err.message); }
    setIsUploading(false);
  };
  const handleDeleteBanner = (id) => {
    saveBanner(bannerImages.filter(b => b.id !== id));
    logActivity('Menghapus banner');
  };

  const handleSaveLogo = async () => {
    if (!logoFile) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(logoFile);
      saveLogo(imageUrl);
      setLogoFile(null); setPreviewLogo(null);
      logActivity('Mengubah logo');
      alert('Logo berhasil diperbarui!');
    } catch (err) { alert('Upload logo gagal: ' + err.message); }
    setIsUploading(false);
  };
  const handleResetLogo = () => {
    if (window.confirm('Reset logo ke default?')) {
      saveLogo(null); setPreviewLogo(null); setLogoFile(null);
      logActivity('Reset logo ke default');
    }
  };

  const loadPengurusToForm = () => {
    if (pengurus) {
      setPengurusForm({
        ketua: { nama: pengurus.ketua?.nama || '', fotoFile: null },
        sekretaris: { nama: pengurus.sekretaris?.nama || '', fotoFile: null },
        bendahara: { nama: pengurus.bendahara?.nama || '', fotoFile: null },
      });
    }
  };
  const handleSaveInfoPengurus = (role) => {
    const newName = pengurusForm[role].nama;
    const newPengurus = { ...pengurus };
    newPengurus[role] = { ...newPengurus[role], nama: newName };
    savePengurus(newPengurus);
    logActivity(`Mengubah nama ${role}`);
    alert(`Nama ${role} berhasil diperbarui!`);
  };
  const handleUploadFotoPengurus = async (role) => {
    const file = pengurusForm[role].fotoFile;
    if (!file) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      const newPengurus = { ...pengurus };
      newPengurus[role] = { ...newPengurus[role], foto: imageUrl };
      savePengurus(newPengurus);
      setPreviewPengurus({ ...previewPengurus, [role]: null });
      setPengurusForm({ ...pengurusForm, [role]: { ...pengurusForm[role], fotoFile: null } });
      logActivity(`Mengubah foto ${role}`);
      alert(`Foto ${role} berhasil diperbarui!`);
    } catch (err) { alert('Upload foto gagal: ' + err.message); }
    setIsUploading(false);
  };

  const handlePengurusFileChange = (role, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({
        open: true,
        imageSrc: reader.result,
        aspect: 1,
        cropShape: 'round',
        onCropComplete: (croppedBlob) => {
          const croppedFile = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' });
          setPengurusForm({
            ...pengurusForm,
            [role]: { ...pengurusForm[role], fotoFile: croppedFile },
          });
          const previewReader = new FileReader();
          previewReader.onload = () => setPreviewPengurus({ ...previewPengurus, [role]: previewReader.result });
          previewReader.readAsDataURL(croppedFile);
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBeritaFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({
        open: true,
        imageSrc: reader.result,
        aspect: 16 / 9,
        cropShape: 'rect',
        onCropComplete: (croppedBlob) => {
          setBeritaForm({ ...beritaForm, fotoFile: new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' }) });
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({
        open: true,
        imageSrc: reader.result,
        aspect: 2 / 1,
        cropShape: 'rect',
        onCropComplete: (croppedBlob) => {
          setBannerFile(new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' }));
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({
        open: true,
        imageSrc: reader.result,
        aspect: 1,
        cropShape: 'rect',
        onCropComplete: (croppedBlob) => {
          const croppedFile = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' });
          setLogoFile(croppedFile);
          const previewReader = new FileReader();
          previewReader.onload = () => setPreviewLogo(previewReader.result);
          previewReader.readAsDataURL(croppedFile);
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAnggotaFileChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({
        open: true,
        imageSrc: reader.result,
        aspect: 1,
        cropShape: 'rect',
        onCropComplete: async (croppedBlob) => {
          const croppedFile = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' });
          try {
            const url = await uploadImage(croppedFile);
            const updatedAnggota = [...divisiForm.anggota];
            updatedAnggota[index] = { ...updatedAnggota[index], foto: url };
            setDivisiForm({ ...divisiForm, anggota: updatedAnggota });
          } catch (err) { alert('Gagal upload foto: ' + err.message); }
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSejarah = () => {
    localStorage.setItem('himmah_sejarah', JSON.stringify(sejarahForm));
    logActivity('Mengubah data sejarah');
    alert('Sejarah berhasil diperbarui!');
  };

  const handleAddAdmin = () => {
    if (!newAdmin.username || !newAdmin.password) return;
    const updated = [...adminAccountsState, { ...newAdmin }];
    setAdminAccountsState(updated);
    localStorage.setItem('himmah_admin_accounts', JSON.stringify(updated));
    setNewAdmin({ username: '', password: '' });
    logActivity(`Menambah admin "${newAdmin.username}"`);
  };
  const handleDeleteAdmin = (index) => {
    if (adminAccountsState.length <= 1) { alert('Minimal 1 admin.'); return; }
    const removed = adminAccountsState[index];
    const updated = adminAccountsState.filter((_, i) => i !== index);
    setAdminAccountsState(updated);
    localStorage.setItem('himmah_admin_accounts', JSON.stringify(updated));
    logActivity(`Menghapus admin "${removed.username}"`);
  };

  const handleSaveCountdown = () => {
    if (!countdownForm.targetDate) return;
    saveCountdownEvent(countdownForm);
    logActivity('Mengatur countdown acara');
    alert('Countdown acara disimpan!');
  };
  const handleRemoveCountdown = () => {
    if (window.confirm('Hapus countdown?')) {
      removeCountdownEvent();
      setCountdownForm({ title: '', description: '', targetDate: '' });
      logActivity('Menghapus countdown acara');
    }
  };

  const addOption = () => setPollForm({ ...pollForm, options: [...pollForm.options, { text: '', votes: 0 }] });
  const removeOption = (index) => {
    if (pollForm.options.length <= 2) return;
    const newOpts = pollForm.options.filter((_, i) => i !== index);
    setPollForm({ ...pollForm, options: newOpts });
  };
  const updateOption = (index, value) => {
    const newOpts = [...pollForm.options];
    newOpts[index].text = value;
    setPollForm({ ...pollForm, options: newOpts });
  };
  const handleSavePoll = () => {
    if (!pollForm.question.trim()) return;
    const validOptions = pollForm.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) { alert('Minimal 2 opsi'); return; }
    savePoll({ ...pollForm, options: validOptions });
    logActivity('Membuat polling baru');
    alert('Polling disimpan!');
  };
  const handleRemovePoll = () => {
    if (window.confirm('Hapus polling?')) {
      removePoll();
      setPollForm({ question: '', options: [{ text: '', votes: 0 }, { text: '', votes: 0 }] });
      logActivity('Menghapus polling');
    }
  };

  const handleAnggotaSubmit = (e) => {
    e.preventDefault();
    if (!anggotaForm.nim || !anggotaForm.nama || !anggotaForm.password) return;
    if (editAnggotaNim) {
      saveAnggotaList(anggotaList.map(a => a.nim === editAnggotaNim ? anggotaForm : a));
      setEditAnggotaNim(null);
      logActivity(`Mengedit anggota ${anggotaForm.nama}`);
    } else {
      saveAnggotaList([...anggotaList, anggotaForm]);
      logActivity(`Menambah anggota ${anggotaForm.nama}`);
    }
    setAnggotaForm({ nim: '', nama: '', password: '', jurusan: '', angkatan: '', divisi: '', foto: '' });
  };
  const handleDeleteAnggota = (nim) => {
    if (window.confirm('Hapus anggota ini?')) {
      saveAnggotaList(anggotaList.filter(a => a.nim !== nim));
      logActivity(`Menghapus anggota dengan NIM ${nim}`);
    }
  };

  const handleBeritaInternalSubmit = (e) => {
    e.preventDefault();
    if (!beritaInternalForm.judul || !beritaInternalForm.isi) return;
    const newBerita = { ...beritaInternalForm, id: editBeritaInternalId || Date.now() };
    if (editBeritaInternalId) {
      saveBeritaInternal(beritaInternal.map(b => b.id === editBeritaInternalId ? newBerita : b));
      setEditBeritaInternalId(null);
      logActivity('Mengedit berita internal');
    } else {
      saveBeritaInternal([newBerita, ...beritaInternal]);
      logActivity('Menambah berita internal');
    }
    setBeritaInternalForm({ judul: '', isi: '', tanggal: '' });
  };
  const handleDeleteBeritaInternal = (id) => {
    if (window.confirm('Hapus berita internal ini?')) {
      saveBeritaInternal(beritaInternal.filter(b => b.id !== id));
      logActivity('Menghapus berita internal');
    }
  };

  const handleSaveInviteCode = () => {
    saveInviteCode(inviteCodeForm);
    logActivity('Mengubah kode undangan');
    alert('Kode undangan berhasil disimpan!');
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: <TrendingUp size={16} /> },
    { key: 'berita', label: 'Berita', icon: <Newspaper size={16} /> },
    { key: 'divisi', label: 'Divisi', icon: <Users size={16} /> },
    { key: 'banner', label: 'Banner', icon: <Image size={16} /> },
    { key: 'logo', label: 'Logo', icon: <Palette size={16} /> },
    { key: 'pengurus', label: 'Pengurus', icon: <User size={16} /> },
    { key: 'sejarah', label: 'Sejarah', icon: <BookOpen size={16} /> },
    { key: 'adminMgmt', label: 'Admin', icon: <Shield size={16} /> },
    { key: 'anggotaMgmt', label: 'Anggota', icon: <User size={16} /> },
    { key: 'beritaInternal', label: 'Internal', icon: <Newspaper size={16} /> },
    { key: 'invite', label: 'Undangan', icon: <Key size={16} /> },
    { key: 'countdown', label: 'Countdown', icon: <Clock size={16} /> },
    { key: 'polling', label: 'Polling', icon: <BarChart3 size={16} /> },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'pengurus') loadPengurusToForm();
    if (tab === 'countdown' && countdownEvent) setCountdownForm(countdownEvent);
    if (tab === 'polling' && poll) setPollForm(poll);
    if (tab === 'invite') setInviteCodeForm(inviteCode);
  };

  const totalBerita = berita.length;
  const totalDivisi = divisi.length;
  const totalBanner = bannerImages.length;
  const beritaTerbaru = berita.slice(0, 5);

  return (
    <>
      <SEO title="Panel Admin" description="Panel administrasi HIMMAH NW Komisariat STMIK." />
      <div className="min-h-screen bg-[#0a0f0a]">
        <CropModal
          open={cropModal.open}
          onClose={() => setCropModal({ ...cropModal, open: false })}
          imageSrc={cropModal.imageSrc}
          aspect={cropModal.aspect}
          cropShape={cropModal.cropShape}
          onCropComplete={cropModal.onCropComplete}
        />

        <div className="flex min-h-screen">
          {isSidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d1a0d] border-r border-green-900/30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-green-900/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"><span className="text-green-400 font-bold text-sm">HN</span></div>
                  <div><p className="text-white font-bold text-sm">HIMMAH NW</p><p className="text-green-400/60 text-xs">Panel Admin</p></div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white"><X size={20} /></button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {tabs.map(tab => (
                  <button key={tab.key} onClick={() => { handleTabChange(tab.key); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    {tab.icon}{tab.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-green-900/30">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={16} /> Logout</button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="bg-[#0d1a0d] border-b border-green-900/30 px-4 sm:px-6 py-4 flex items-center justify-between lg:hidden">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-white hover:bg-white/10"><Menu size={24} /></button>
              <h1 className="text-white font-bold">Panel Admin</h1>
              <button onClick={logout} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10">Logout</button>
            </header>

            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Dashboard</h2><p className="text-gray-400 text-sm mt-1">Selamat datang di panel admin HIMMAH NW Komisariat STMIK</p></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-5"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Berita</p><p className="text-white text-3xl font-bold mt-1">{totalBerita}</p></div><div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center"><Newspaper size={24} className="text-blue-400" /></div></div></div>
                    <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-5"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Divisi</p><p className="text-white text-3xl font-bold mt-1">{totalDivisi}</p></div><div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center"><Users size={24} className="text-purple-400" /></div></div></div>
                    <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-5"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Banner</p><p className="text-white text-3xl font-bold mt-1">{totalBanner}</p></div><div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center"><Image size={24} className="text-orange-400" /></div></div></div>
                    <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-5"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Logo Aktif</p><p className="text-white text-3xl font-bold mt-1">{logo ? '1' : '0'}</p></div><div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center"><Palette size={24} className="text-green-400" /></div></div></div>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">💾 Backup & Restore Data</h3>
                    <p className="text-gray-400 text-sm mb-4">Download semua data sebagai file JSON untuk backup, atau upload file backup untuk restore.</p>
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={() => { const data = { berita, divisi, pengurus, bannerImages, logo, countdownEvent, poll, anggotaList, beritaInternal, inviteCode }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `backup-himmah-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url); }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium">📥 Download Backup</button>
                      <label className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium cursor-pointer">📤 Restore Backup <input type="file" accept=".json" onChange={async (e) => { const file = e.target.files[0]; if (!file) return; if (!window.confirm('Yakin ingin merestore data?')) return; try { const text = await file.text(); const data = JSON.parse(text); saveBerita(data.berita || []); saveDivisi(data.divisi || []); savePengurus(data.pengurus || defaultPengurus); saveBanner(data.bannerImages || []); saveLogo(data.logo || null); if (data.countdownEvent) saveCountdownEvent(data.countdownEvent); if (data.poll) savePoll(data.poll); if (data.anggotaList) saveAnggotaList(data.anggotaList); if (data.beritaInternal) saveBeritaInternal(data.beritaInternal); if (data.inviteCode) saveInviteCode(data.inviteCode); alert('Restore berhasil!'); } catch (err) { alert('Gagal restore: ' + err.message); } }} className="hidden" /></label>
                    </div>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-white font-bold text-lg">Berita Terbaru</h3><button onClick={() => handleTabChange('berita')} className="text-green-400 text-sm hover:underline">Lihat Semua</button></div>
                    <div className="space-y-3">
                      {beritaTerbaru.length === 0 && <p className="text-gray-400 text-sm">Belum ada berita.</p>}
                      {beritaTerbaru.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                          <span className="text-2xl font-bold text-green-400/40 w-8">{index + 1}</span>
                          {item.foto && <img src={item.foto} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                          <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium line-clamp-1">{item.judul}</p><div className="flex items-center gap-3 text-xs text-gray-400 mt-1"><span className="flex items-center gap-1"><Calendar size={12} /> {item.tanggal}</span>{item.kategori && <span className="flex items-center gap-1"><Tag size={12} /> {item.kategori}</span>}</div></div>
                          <button onClick={() => handleEditBerita(item)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"><Edit3 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">📋 Riwayat Aktivitas</h3>
                    {activityLog.length === 0 ? <p className="text-gray-400 text-sm">Belum ada aktivitas.</p> : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {activityLog.map((entry, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <span className="text-green-400/50 text-xs whitespace-nowrap">{new Date(entry.timestamp).toLocaleString('id-ID')}</span>
                            <span className="text-green-100/80">{entry.action}</span>
                            <span className="text-gray-500 text-xs ml-auto">{entry.user}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'berita' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div><h2 className="text-2xl font-playfair font-bold text-white">Manajemen Berita</h2><p className="text-gray-400 text-sm mt-1">Kelola semua berita dan publikasi</p></div>
                    <button onClick={() => { setEditBeritaId(null); setBeritaForm({ judul: '', tanggal: '', kategori: '', fotoFile: null, kontenHTML: '' }); setActiveTab('berita'); }} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center gap-2 text-sm font-medium"><Plus size={16} /> Tulis Berita</button>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]"><Search size={18} className="text-gray-400" /><input type="text" placeholder="Cari judul berita..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-white text-sm w-full focus:outline-none" /></div>
                    <input type="text" placeholder="Filter kategori..." value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm w-40" />
                    <input type="date" value={filterTanggal} onChange={(e) => setFilterTanggal(e.target.value)} className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm" />
                    <button onClick={() => { setSearchQuery(''); setFilterKategori(''); setFilterTanggal(''); }} className="px-3 py-2 bg-gray-500/30 text-white rounded-lg text-sm">Reset</button>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">{editBeritaId ? '✏️ Edit Berita' : '📝 Tulis Berita Baru'}</h3>
                    <form onSubmit={handleBeritaSubmit} className="space-y-4">
                      <input type="text" placeholder="Judul Berita" value={beritaForm.judul} onChange={(e) => setBeritaForm({ ...beritaForm, judul: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400 text-lg font-semibold" required />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div><label className="text-gray-400 text-xs mb-1 block">Tanggal</label><input type="date" value={beritaForm.tanggal} onChange={(e) => setBeritaForm({ ...beritaForm, tanggal: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400" /></div>
                        <div><label className="text-gray-400 text-xs mb-1 block">Kategori</label><input type="text" placeholder="Contoh: Sosial" value={beritaForm.kategori} onChange={(e) => setBeritaForm({ ...beritaForm, kategori: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" /></div>
                        <div>
                          <label className="text-gray-400 text-xs mb-1 block">Foto Sampul</label>
                          <input type="file" accept="image/*" ref={fileBeritaRef} onChange={(e) => { const file = e.target.files[0]; if (file) handleBeritaFileChange(file); }} className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white" />
                        </div>
                      </div>
                      <div><label className="text-gray-400 text-xs mb-1 block">Konten Berita</label><RichTextEditor value={beritaForm.kontenHTML} onChange={(value) => setBeritaForm({ ...beritaForm, kontenHTML: value })} placeholder="Tulis konten berita di sini..." /></div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={isUploading} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50">{isUploading ? 'Mengunggah...' : <><Save size={16} /> {editBeritaId ? 'Update' : 'Publikasikan'}</>}</button>
                        {editBeritaId && <button type="button" onClick={() => { setEditBeritaId(null); setBeritaForm({ judul: '', tanggal: '', kategori: '', fotoFile: null, kontenHTML: '' }); }} className="px-6 py-3 bg-gray-500/30 text-white rounded-xl hover:bg-gray-500/50 transition-colors flex items-center gap-2"><X size={16} /> Batal</button>}
                      </div>
                    </form>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">📋 Semua Berita ({filteredBerita.length})</h3>
                    {filteredBerita.length === 0 ? <p className="text-gray-400 text-sm">Tidak ada berita.</p> : (
                      <div className="space-y-3">
                        {filteredBerita.map((item, index) => (
                          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4"><span className="text-2xl font-bold text-green-400/40 w-8 flex-shrink-0">{index + 1}</span>{item.foto && <img src={item.foto} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}<div><p className="text-white font-medium line-clamp-1">{item.judul}</p><div className="flex items-center gap-3 text-xs text-gray-400 mt-1"><span className="flex items-center gap-1"><Calendar size={12} /> {item.tanggal}</span>{item.kategori && <span className="flex items-center gap-1"><Tag size={12} /> {item.kategori}</span>}</div></div></div>
                            <div className="flex gap-2 self-end sm:self-auto"><button onClick={() => handleEditBerita(item)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit3 size={14} /></button><button onClick={() => handleDeleteBerita(item.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={14} /></button></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'divisi' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Manajemen Divisi</h2><p className="text-gray-400 text-sm mt-1">Kelola divisi, program kerja, dan anggota</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">{editDivisiId ? '✏️ Edit Divisi' : '➕ Tambah Divisi Baru'}</h3>
                    <form onSubmit={handleDivisiSubmit} className="space-y-4">
                      <input type="text" placeholder="Nama Divisi" value={divisiForm.nama} onChange={(e) => setDivisiForm({ ...divisiForm, nama: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" required />
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Program Kerja (satu per baris)</label>
                        <textarea placeholder="Masukkan program kerja, satu per baris" value={divisiForm.programKerja} onChange={(e) => setDivisiForm({ ...divisiForm, programKerja: e.target.value })} rows="4" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400 resize-none" required />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-2 block">Anggota</label>
                        <div className="space-y-3">
                          {divisiForm.anggota.map((anggota, index) => (
                            <div key={index} className="border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start gap-3">
                              <div className="flex-shrink-0">
                                <img src={anggota.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(anggota.nama || '?')}&background=004d24&color=fff&size=50`} alt={anggota.nama} className="w-12 h-12 rounded-full object-cover border border-green-400/30" />
                                <label className="block text-green-400/60 text-xs mt-1 text-center cursor-pointer hover:text-green-300">
                                  <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) handleAnggotaFileChange(index, file); }} className="hidden" /> 📷
                                </label>
                              </div>
                              <div className="flex-1 space-y-2 w-full">
                                <input type="text" placeholder="Nama anggota" value={anggota.nama} onChange={(e) => { const updatedAnggota = [...divisiForm.anggota]; updatedAnggota[index] = { ...updatedAnggota[index], nama: e.target.value }; setDivisiForm({ ...divisiForm, anggota: updatedAnggota }); }} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm" />
                                <select value={anggota.jabatan} onChange={(e) => { const updatedAnggota = [...divisiForm.anggota]; updatedAnggota[index] = { ...updatedAnggota[index], jabatan: e.target.value }; setDivisiForm({ ...divisiForm, anggota: updatedAnggota }); }} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
                                  <option value="Anggota" className="bg-gray-800">Anggota</option>
                                  <option value="Kadiv" className="bg-gray-800">Kadiv</option>
                                </select>
                              </div>
                              <button type="button" onClick={() => { const updatedAnggota = divisiForm.anggota.filter((_, i) => i !== index); setDivisiForm({ ...divisiForm, anggota: updatedAnggota }); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg self-center"><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => setDivisiForm({ ...divisiForm, anggota: [...divisiForm.anggota, { nama: '', jabatan: 'Anggota', foto: '' }] })} className="mt-3 px-4 py-2 bg-white/10 text-white rounded-xl text-sm flex items-center gap-1"><Plus size={16} /> Tambah Anggota</button>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"><Save size={16} /> {editDivisiId ? 'Update' : 'Simpan Divisi'}</button>
                        {editDivisiId && <button type="button" onClick={() => { setEditDivisiId(null); setDivisiForm({ nama: '', programKerja: '', anggota: [{ nama: '', jabatan: 'Anggota', foto: '' }] }); }} className="px-6 py-3 bg-gray-500/30 text-white rounded-xl hover:bg-gray-500/50 transition-colors flex items-center gap-2"><X size={16} /> Batal</button>}
                      </div>
                    </form>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">📋 Daftar Divisi ({divisi.length})</h3>
                    {divisi.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 rounded-xl mb-2">
                        <div><p className="text-white font-medium">{item.nama}</p><p className="text-gray-400 text-xs">{item.anggota.length} anggota · {item.programKerja.length} proker</p></div>
                        <div className="flex gap-2 self-end sm:self-auto"><button onClick={() => handleEditDivisi(item)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit3 size={14} /></button><button onClick={() => handleDeleteDivisi(item.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={14} /></button></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'banner' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Manajemen Banner</h2><p className="text-gray-400 text-sm mt-1">Kelola banner slider di beranda</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">➕ Tambah Banner</h3>
                    <form onSubmit={handleBannerSubmit} className="space-y-4">
                      <div><label className="text-gray-400 text-xs mb-1 block">File Gambar</label><input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) handleBannerFileChange(file); }} className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white" required /></div>
                      <input type="text" placeholder="Deskripsi Banner" value={bannerAlt} onChange={(e) => setBannerAlt(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" required />
                      <button type="submit" disabled={isUploading} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50">{isUploading ? 'Mengunggah...' : <><Plus size={16} /> Tambah Banner</>}</button>
                    </form>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">🖼️ Banner Aktif ({bannerImages.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {bannerImages.map(banner => (
                        <div key={banner.id} className="relative bg-white/5 rounded-xl overflow-hidden group">
                          <img src={banner.src} alt={banner.alt} className="w-full h-40 object-cover" onError={(e) => (e.target.src = 'https://placehold.co/400x200/333/fff?text=Error')} />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button onClick={() => handleDeleteBanner(banner.id)} className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600"><Trash2 size={18} /></button></div>
                          <p className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">{banner.alt}</p>
                        </div>
                      ))}
                      {bannerImages.length === 0 && <p className="text-gray-400 col-span-2 text-center py-8">Belum ada banner custom.</p>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logo' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Pengaturan Logo</h2><p className="text-gray-400 text-sm mt-1">Atur logo yang muncul di navbar dan header</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="text-center"><p className="text-gray-400 text-sm mb-2">Logo Saat Ini</p><img src={logo || '/img/logo.png'} alt="Logo" className="w-24 h-24 object-contain rounded-full border-2 border-green-400/30 bg-white/5" onError={(e) => (e.target.src = '/img/logo.png')} /></div>
                      <div className="flex-1">
                        <label className="block text-gray-400 text-sm mb-2">Upload Logo Baru (PNG/JPG)</label>
                        <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) handleLogoFileChange(file); }} className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white" />
                        {previewLogo && (
                          <div className="mt-3 flex items-center gap-4">
                            <img src={previewLogo} alt="Preview" className="w-16 h-16 object-contain rounded-lg border border-green-400/30" />
                            <div className="flex gap-2"><button onClick={handleSaveLogo} disabled={isUploading} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center gap-2 text-sm disabled:opacity-50">{isUploading ? 'Menyimpan...' : <><Check size={16} /> Simpan Logo</>}</button><button onClick={() => { setPreviewLogo(null); setLogoFile(null); }} className="px-4 py-2 bg-gray-500/30 text-white rounded-xl hover:bg-gray-500/50 text-sm">Batal</button></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-green-900/30 pt-4"><button onClick={handleResetLogo} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 flex items-center gap-2 text-sm"><Trash2 size={16} /> Reset ke Logo Default</button></div>
                  </div>
                </div>
              )}

              {activeTab === 'pengurus' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Edit Pengurus Inti</h2><p className="text-gray-400 text-sm mt-1">Ubah nama dan foto Ketua, Sekretaris, Bendahara</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6 space-y-8">
                    {['ketua', 'sekretaris', 'bendahara'].map((role) => (
                      <div key={role} className="border border-green-900/20 rounded-xl p-5 space-y-4">
                        <h3 className="text-white font-semibold capitalize text-lg">{role} - {pengurus?.[role]?.nama || 'Belum ada data'}</h3>
                        <div className="flex items-start gap-4">
                          <img src={previewPengurus[role] || pengurus?.[role]?.foto || '/img/logo.png'} alt={role} className="w-20 h-20 rounded-full object-cover border-2 border-green-400/30" onError={(e) => { e.target.src = '/img/logo.png'; }} />
                          <div className="flex-1">
                            <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) handlePengurusFileChange(role, file); }} className="block text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white" />
                            {pengurusForm[role].fotoFile && <button onClick={() => handleUploadFotoPengurus(role)} disabled={isUploading} className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg text-sm">{isUploading ? 'Mengunggah...' : 'Simpan Foto'}</button>}
                          </div>
                        </div>
                        <div><label className="text-gray-400 text-xs">Nama</label><input type="text" value={pengurusForm[role].nama} onChange={(e) => setPengurusForm({ ...pengurusForm, [role]: { ...pengurusForm[role], nama: e.target.value } })} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm" /></div>
                        <button onClick={() => handleSaveInfoPengurus(role)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"><Save size={14} /> Simpan Nama</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'sejarah' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Edit Sejarah Komisariat</h2><p className="text-gray-400 text-sm mt-1">Ubah tahun berdiri dan deskripsi</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6 space-y-4">
                    <div><label className="text-gray-400 text-xs mb-1 block">Tahun Berdiri</label><input type="text" value={sejarahForm.tahunBerdiri} onChange={(e) => setSejarahForm({ ...sejarahForm, tahunBerdiri: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" /></div>
                    <div><label className="text-gray-400 text-xs mb-1 block">Deskripsi</label><textarea value={sejarahForm.deskripsi} onChange={(e) => setSejarahForm({ ...sejarahForm, deskripsi: e.target.value })} rows="5" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white resize-none" /></div>
                    <button onClick={handleSaveSejarah} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold"><Save size={16} className="inline mr-2" /> Simpan Sejarah</button>
                  </div>
                </div>
              )}

              {activeTab === 'adminMgmt' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Manajemen Admin</h2><p className="text-gray-400 text-sm mt-1">Tambah atau hapus akun admin</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Username" value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                      <input type="password" placeholder="Password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                    </div>
                    <button onClick={handleAddAdmin} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium"><Plus size={16} className="inline mr-1" /> Tambah Admin</button>
                    <div className="mt-6">
                      <h4 className="text-white font-semibold mb-3">Daftar Admin ({adminAccountsState.length})</h4>
                      <div className="space-y-2">
                        {adminAccountsState.map((admin, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div><p className="text-white text-sm font-medium">{admin.username}</p><p className="text-gray-400 text-xs">••••••</p></div>
                            <button onClick={() => handleDeleteAdmin(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'anggotaMgmt' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Manajemen Anggota</h2><p className="text-gray-400 text-sm mt-1">Kelola data anggota untuk portal</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">{editAnggotaNim ? '✏️ Edit Anggota' : '➕ Tambah Anggota'}</h3>
                    <form onSubmit={handleAnggotaSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input type="text" placeholder="NIM" value={anggotaForm.nim} onChange={(e) => setAnggotaForm({ ...anggotaForm, nim: e.target.value })} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" required />
                        <input type="text" placeholder="Nama" value={anggotaForm.nama} onChange={(e) => setAnggotaForm({ ...anggotaForm, nama: e.target.value })} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" required />
                        <input type="password" placeholder="Password" value={anggotaForm.password} onChange={(e) => setAnggotaForm({ ...anggotaForm, password: e.target.value })} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input type="text" placeholder="Jurusan" value={anggotaForm.jurusan} onChange={(e) => setAnggotaForm({ ...anggotaForm, jurusan: e.target.value })} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                        <input type="text" placeholder="Angkatan" value={anggotaForm.angkatan} onChange={(e) => setAnggotaForm({ ...anggotaForm, angkatan: e.target.value })} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                        <input type="text" placeholder="Divisi" value={anggotaForm.divisi} onChange={(e) => setAnggotaForm({ ...anggotaForm, divisi: e.target.value })} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm"><Save size={16} className="inline mr-1" /> {editAnggotaNim ? 'Update' : 'Simpan'}</button>
                        {editAnggotaNim && <button type="button" onClick={() => { setEditAnggotaNim(null); setAnggotaForm({ nim: '', nama: '', password: '', jurusan: '', angkatan: '', divisi: '', foto: '' }); }} className="px-4 py-2 bg-gray-500/30 text-white rounded-xl text-sm"><X size={16} className="inline mr-1" /> Batal</button>}
                      </div>
                    </form>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">📋 Daftar Anggota ({anggotaList.length})</h3>
                    <div className="space-y-2">
                      {anggotaList.map((a) => (
                        <div key={a.nim} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div><p className="text-white text-sm font-medium">{a.nama}</p><p className="text-gray-400 text-xs">{a.nim} · {a.divisi || '-'}</p></div>
                          <div className="flex gap-2">
                            <button onClick={() => { setAnggotaForm(a); setEditAnggotaNim(a.nim); setActiveTab('anggotaMgmt'); }} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit3 size={14} /></button>
                            <button onClick={() => handleDeleteAnggota(a.nim)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'beritaInternal' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Berita Internal</h2><p className="text-gray-400 text-sm mt-1">Kelola berita untuk anggota</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">{editBeritaInternalId ? '✏️ Edit Berita' : '➕ Tambah Berita'}</h3>
                    <form onSubmit={handleBeritaInternalSubmit} className="space-y-3">
                      <input type="text" placeholder="Judul Berita" value={beritaInternalForm.judul} onChange={(e) => setBeritaInternalForm({ ...beritaInternalForm, judul: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" required />
                      <textarea placeholder="Isi Berita" value={beritaInternalForm.isi} onChange={(e) => setBeritaInternalForm({ ...beritaInternalForm, isi: e.target.value })} rows="5" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white resize-none" required />
                      <input type="date" value={beritaInternalForm.tanggal} onChange={(e) => setBeritaInternalForm({ ...beritaInternalForm, tanggal: e.target.value })} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                      <div className="flex gap-3">
                        <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm"><Save size={16} className="inline mr-1" /> {editBeritaInternalId ? 'Update' : 'Simpan'}</button>
                        {editBeritaInternalId && <button type="button" onClick={() => { setEditBeritaInternalId(null); setBeritaInternalForm({ judul: '', isi: '', tanggal: '' }); }} className="px-4 py-2 bg-gray-500/30 text-white rounded-xl text-sm"><X size={16} className="inline mr-1" /> Batal</button>}
                      </div>
                    </form>
                  </div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">📋 Daftar Berita Internal ({beritaInternal.length})</h3>
                    <div className="space-y-2">
                      {beritaInternal.map((b) => (
                        <div key={b.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div><p className="text-white text-sm font-medium">{b.judul}</p><p className="text-gray-400 text-xs">{b.tanggal}</p></div>
                          <div className="flex gap-2">
                            <button onClick={() => { setBeritaInternalForm(b); setEditBeritaInternalId(b.id); setActiveTab('beritaInternal'); }} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit3 size={14} /></button>
                            <button onClick={() => handleDeleteBeritaInternal(b.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'invite' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Kode Undangan Anggota</h2><p className="text-gray-400 text-sm mt-1">Atur kode rahasia untuk pendaftaran anggota baru</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Kode Undangan</label>
                      <input type="text" value={inviteCodeForm} onChange={(e) => setInviteCodeForm(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" placeholder="Masukkan kode undangan" />
                    </div>
                    <button onClick={handleSaveInviteCode} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium"><Save size={16} className="inline mr-1" /> Simpan Kode</button>
                  </div>
                </div>
              )}

              {activeTab === 'countdown' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Countdown Acara</h2><p className="text-gray-400 text-sm mt-1">Atur hitung mundur ke acara besar</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6 space-y-4">
                    <div><label className="text-gray-400 text-xs mb-1 block">Judul Acara</label><input type="text" placeholder="Contoh: Pelantikan" value={countdownForm.title} onChange={(e) => setCountdownForm({ ...countdownForm, title: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" /></div>
                    <div><label className="text-gray-400 text-xs mb-1 block">Deskripsi (opsional)</label><input type="text" value={countdownForm.description} onChange={(e) => setCountdownForm({ ...countdownForm, description: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" /></div>
                    <div><label className="text-gray-400 text-xs mb-1 block">Tanggal & Waktu Acara</label><input type="datetime-local" value={countdownForm.targetDate} onChange={(e) => setCountdownForm({ ...countdownForm, targetDate: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" required /></div>
                    <div className="flex gap-3">
                      <button onClick={handleSaveCountdown} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium"><Save size={16} className="inline mr-1" /> Simpan Countdown</button>
                      {countdownEvent && <button onClick={handleRemoveCountdown} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium"><Trash2 size={16} className="inline mr-1" /> Hapus Countdown</button>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'polling' && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-playfair font-bold text-white">Jajak Pendapat</h2><p className="text-gray-400 text-sm mt-1">Buat polling untuk pengunjung</p></div>
                  <div className="bg-[#111a11] border border-green-900/30 rounded-2xl p-6 space-y-4">
                    <div><label className="text-gray-400 text-xs mb-1 block">Pertanyaan</label><input type="text" placeholder="Tulis pertanyaan..." value={pollForm.question} onChange={(e) => setPollForm({ ...pollForm, question: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" /></div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Opsi Jawaban</label>
                      <div className="space-y-2">
                        {pollForm.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input type="text" placeholder={`Opsi ${i + 1}`} value={opt.text} onChange={(e) => updateOption(i, e.target.value)} className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                            {pollForm.options.length > 2 && <button onClick={() => removeOption(i)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>}
                          </div>
                        ))}
                      </div>
                      <button onClick={addOption} className="mt-2 px-4 py-2 bg-white/10 text-white rounded-xl text-sm"><Plus size={16} className="inline mr-1" /> Tambah Opsi</button>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSavePoll} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium"><Save size={16} className="inline mr-1" /> Simpan Polling</button>
                      {poll && <button onClick={handleRemovePoll} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium"><Trash2 size={16} className="inline mr-1" /> Hapus Polling</button>}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}