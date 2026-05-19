```markdown
# HIMMAH NW Komisariat STMIK

![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fhimmahnw-komstmik.vercel.app)
![License](https://img.shields.io/github/license/marketlloyd-dev/himmah-nw)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

Website resmi **HIMMAH NW Komisariat STMIK** – Himpunan Mahasiswa Nahdlatul Wathan.  
Wadah informasi, berita, galeri kegiatan, dan profil organisasi.

---

## ✨ Fitur Utama

### 📰 Berita & Publikasi
- CRUD berita dengan rich text editor (bold, italic, heading, link, gambar)
- Paragraf terstruktur (judul + isi)
- Komentar terpusat (tersimpan di Vercel Blob)
- Share button (WhatsApp, Facebook, Twitter, Telegram)
- Pencarian & filter berita

### 🖼️ Galeri Foto
- Upload banyak foto sekaligus dengan crop
- Lightbox untuk melihat foto besar
- Admin bisa hapus foto

### 👥 Struktur Pengurus
- Tampilan pengurus inti + anggota divisi dengan foto
- Tag Kadiv & Anggota
- Program kerja per divisi

### 📊 Panel Admin
- Dashboard statistik (total berita, divisi, banner, logo)
- Manajemen divisi (CRUD anggota dengan foto, program kerja)
- Manajemen pengurus (upload foto + crop, edit nama)
- Manajemen logo & banner slider
- Edit sejarah komisariat
- Manajemen akun admin
- Backup & restore data
- Countdown acara
- Polling / jajak pendapat
- Riwayat aktivitas (audit log)

### 🔔 Notifikasi
- Izin notifikasi browser
- Pendeteksi berita baru (service worker)

### 📱 UI/UX
- Responsif semua perangkat
- Back to top button
- Glass morphism design
- Scrollable navbar di desktop
- Sidebar offcanvas di mobile
- PWA (bisa diinstal)

### 🔍 SEO & Analytics
- Meta tags dinamis (React Helmet)
- Google Analytics
- Sitemap siap

---

## 🛠️ Teknologi

| Kategori | Teknologi |
|----------|-----------|
| Frontend | React 19, React Router, Tailwind CSS |
| Editor | Custom rich text (contentEditable + toolbar) |
| Crop Gambar | react-easy-crop |
| Ikon | Lucide React |
| SEO | React Helmet Async |
| Hosting | Vercel |
| Database | Vercel Blob (JSON file) |
| Gambar | ImgBB API (gratis) |
| Notifikasi | Web Notification API + Service Worker |

---

## 🚀 Cara Menjalankan (Development)

1. Clone repository
   ```bash
   git clone https://github.com/marketlloyd-dev/himmah-nw.git
   cd himmah-nw
   ```

2. Install dependensi
   ```bash
   npm install
   ```

3. Buat file `.env` (atau gunakan Environment Variables di Vercel)
   ```
   VITE_IMGBB_API_KEY=your_imgbb_api_key
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX  (opsional)
   ```

4. Jalankan dev server
   ```bash
   npm run dev
   ```

5. Buka `http://localhost:5173`

---

## 📦 Build Production

```bash
npm run build
```

Hasil build ada di folder `dist/`, siap dideploy.

---

## 📂 Struktur Folder

```
himmah-nw/
├── api/
│   └── save-data.js         # API untuk menyimpan data ke Vercel Blob
├── public/
│   ├── img/                 # Gambar statis (logo, banner, foto)
│   ├── manifest.json        # PWA
│   └── service-worker.js    # Service worker untuk notifikasi
├── src/
│   ├── components/          # Komponen reusable (Navbar, Footer, dll)
│   ├── context/             # AppContext (state global + data management)
│   ├── data/                # Konfigurasi (akun admin, sosial media, kontak)
│   ├── pages/               # Halaman (Beranda, Informasi, Berita, dll)
│   ├── App.jsx              # Router utama
│   ├── main.jsx             # Entry point
│   └── index.css            # Styling global
├── vercel.json              # Konfigurasi Vercel (rewrite untuk SPA)
└── package.json
```

---

## ⚙️ Environment Variables (Vercel)

| Key | Deskripsi |
|-----|-----------|
| `VITE_IMGBB_API_KEY` | API key ImgBB untuk upload gambar |
| `VITE_GA_TRACKING_ID` | Google Analytics Measurement ID (opsional) |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob untuk penyimpanan data |

---

## 🗃️ Penyimpanan Data

Data website (berita, divisi, pengurus, komentar, dll) disimpan dalam file `data.json` di **Vercel Blob**.  
Sistem hybrid: **localStorage** sebagai cache, **Blob** sebagai sumber utama.  
Setiap perubahan dari admin akan disimpan ke Blob melalui API `/api/save-data`.

---

## 👤 Akun Admin Default

- Username: `admin`
- Password: `himmah2024`

> **Catatan:** Ganti password setelah login pertama melalui panel Admin → tab Admin.

---

## 📝 Lisensi

Proyek ini dibuat untuk **HIMMAH NW Komisariat STMIK**.  
Kode sumber tersedia untuk referensi dan pengembangan organisasi.

---

## 🤝 Kontribusi

Dikembangkan oleh Tim IT HIMMAH NW.  
Jika ada pertanyaan atau ingin berkontribusi, hubungi kami melalui media sosial di footer website.

---

**Dibuat dengan ❤️ untuk HIMMAH NW Komisariat STMIK**
```
