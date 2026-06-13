# Product Assistant — KCP Sunter Permai

Aplikasi web **katalog & alat bantu pitching produk** Bank Mandiri untuk seluruh pegawai
cabang (frontliner inbranch maupun sales outbranch). Tujuannya: siapa pun bisa menjelaskan
produk secara cepat, seragam, dan langsung mengarahkan calon nasabah ke PIC yang tepat —
cukup dari HP, di depan calon nasabah.

**Mobile-first.** Fokus produk cabang: Merchant & QRIS, Tabungan & Livin', Kredit UMKM,
Kredit Retail, Payroll & Korporasi, Rekening Badan, dan Kartu Kredit.

---

## Fitur

- **Beranda** — pencarian global + grid kategori + akses cepat (Rekomendasi, Prospek, Compare, Favorit, dan Asisten).
- **Daftar produk per kategori** dan **pencarian** (nama / deskripsi / target nasabah).
- **Detail produk** — highlight menonjol, deskripsi, target, benefit (checklist), syarat,
  biaya/bunga, dan **tombol besar "Hubungi PIC" → WhatsApp** (pesan otomatis) + telepon.
- **Mode Pitch Card** — tampilan satu layar font besar untuk diperlihatkan ke calon nasabah.
- **Rekomendasi sederhana (rule-based)** — pilih tipe nasabah + kebutuhan → 1–3 produk cocok.
- **Favorit** (localStorage), **catatan prospek**, **compare produk**, dan **bagikan link** produk.
- **Sumber data Google Spreadsheet** (CSV) + **fallback data lokal** bila offline.

---

## Teknologi

- Vite + React 18 (JavaScript, tanpa TypeScript)
- Tailwind CSS, lucide-react (ikon), papaparse (parsing CSV), react-router-dom (navigasi)
- Tanpa backend, tanpa login. `localStorage` hanya untuk favorit.

---

## Menjalankan secara lokal

Prasyarat: **Node.js 18+** dan npm.

```bash
npm install      # pasang dependency
npm run dev      # jalankan mode pengembangan (buka URL yang muncul, mis. http://localhost:5173)
```

Build static site + pratinjau hasil build:

```bash
npm run build    # hasil ada di folder dist/
npm run preview  # pratinjau hasil build secara lokal
```

---

## Memperbarui data produk lewat Google Spreadsheet

Pegawai cabang bisa memperbarui info produk (bunga, syarat, PIC) **cukup lewat spreadsheet**,
tanpa menyentuh kode.

### 1. Siapkan spreadsheet

Buat Google Spreadsheet dengan **baris pertama = nama kolom** persis seperti ini:

```
kategori | nama_produk | deskripsi_singkat | target_nasabah | benefit | syarat_utama | highlight | biaya_bunga | pic_nama | pic_jabatan | pic_wa | pic_telp | prioritas | aktif | kegunaan | cara_pengajuan
```

Aturan pengisian:

- `kategori` — salah satu dari: `Merchant & QRIS`, `Tabungan & Livin'`, `Kredit UMKM`,
  `Kredit Retail`, `Payroll & Korporasi`, `Rekening Badan`, `Kartu Kredit`, `Lainnya`.
- `benefit` dan `syarat_utama` — daftar dipisah tanda **`|`** (mis. `Gratis admin|Setoran ringan`).
- `kegunaan` *(opsional)* — daftar "Cocok untuk kebutuhan" dipisah `|`, tampil sebagai checklist
  di halaman detail.
- `cara_pengajuan` *(opsional)* — langkah pengajuan berurutan dipisah `|`, tampil sebagai
  daftar bernomor di halaman detail.
- `pic_wa` — format **628xxx** (tanpa `+`, spasi, atau strip).
- `prioritas` — angka; makin kecil makin atas.
- `aktif` — `ya` / `tidak` (yang `tidak` disembunyikan dari aplikasi).

> Contoh isi data bisa dilihat di [`src/data/produk-fallback.json`](src/data/produk-fallback.json)
> (23 produk dummy). Data ini juga dipakai otomatis saat offline.

### 2. Publish ke web sebagai CSV

1. Di Google Sheets: **File → Share → Publish to web** (Bagikan → Publikasikan ke web).
2. Pilih **sheet** yang berisi data, lalu format **Comma-separated values (.csv)**.
3. Klik **Publish**, salin URL yang muncul. Bentuknya seperti:

   ```
   https://docs.google.com/spreadsheets/d/e/XXXXXXXXXXXX/pub?gid=0&single=true&output=csv
   ```

### 3. Pasang URL ke aplikasi

Buka [`src/config/config.js`](src/config/config.js) dan isi konstanta `SHEET_CSV_URL`:

```js
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=0&single=true&output=csv'
```

Simpan, jalankan ulang (`npm run dev`) atau build ulang. Selesai.

### Fallback offline

Jika `SHEET_CSV_URL` kosong, gagal di-fetch, atau perangkat offline, aplikasi otomatis
memakai data lokal `src/data/produk-fallback.json` dan menampilkan tanda **"Data offline (lokal)"**
di footer. Aplikasi **tidak pernah blank** hanya karena internet bermasalah.

---

## Asisten Produk (AI)

Halaman **/asisten** menyediakan chat tanya-jawab bebas seputar produk. Jawaban di-ground ke
data katalog (hanya data produk publik yang dikirim — **tidak pernah** data nasabah/prospek).

Cara kerjanya:

- Browser memanggil endpoint internal `POST /api/chat` (bukan langsung ke penyedia AI).
- Endpoint itu adalah **serverless function Vercel** ([`api/chat.js`](api/chat.js)) yang
  meneruskan permintaan ke SumoPod (OpenAI-compatible). **API key hanya hidup di server.**
- Saat `npm run dev`, endpoint yang sama ditiru oleh middleware di
  [`vite.config.js`](vite.config.js) supaya bisa diuji lokal.

Konfigurasi key:

1. **Lokal** — buat file `.env.local` (sudah ter-gitignore) berisi:
   ```
   SUMOPOD_API_KEY=sk-xxxx
   SUMOPOD_MODEL=deepseek-v4-pro
   ```
2. **Production** — di Vercel: **Settings → Environment Variables**, tambahkan
   `SUMOPOD_API_KEY` (dan opsional `SUMOPOD_MODEL`, `SUMOPOD_BASE_URL`).

Jika key tidak diset atau layanan AI gagal, aplikasi **tetap berfungsi penuh** — halaman
asisten menampilkan pesan fallback yang mengarahkan ke fitur Rekomendasi dan kontak PIC.

---

## Deploy ke Vercel

1. Push proyek ini ke repository GitHub.
2. Buka [vercel.com](https://vercel.com) → **Add New → Project** → pilih repo.
3. Vercel mendeteksi Vite otomatis. Pastikan setelan:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Klik **Deploy**. Aplikasi langsung online dan bisa dibuka dari HP pegawai.

> Deploy ke **Netlify** juga sama: build command `npm run build`, publish directory `dist`.
> Aplikasi memakai HashRouter sehingga deep-link (mis. `#/produk/qris-mandiri`) tetap jalan
> tanpa konfigurasi rewrite server tambahan.

---

## Struktur proyek

```
src/
├── components/   # komponen UI (Header, SearchBar, ProdukCard, PitchCard, dll.)
├── pages/        # halaman (Beranda, Kategori, Detail, Rekomendasi, Favorit, Prospek, Compare, Asisten)
├── lib/          # logika (parsing CSV, rekomendasi, favorit, util WA)
├── data/         # produk-fallback.json (data lokal offline)
└── config/       # config.js (SHEET_CSV_URL, kategori, dll.)
```

---

## Catatan

- Semua data PIC/produk pada `produk-fallback.json` adalah **dummy**, bukan data asli.
- Aturan rekomendasi ditulis transparan di [`src/lib/rekomendasi.js`](src/lib/rekomendasi.js)
  (rule-based, **bukan AI**) agar mudah dijelaskan.

---

_Konsep diadaptasi dari inisiatif Retail Product Information System KCP Graha Mitra (ODP 325),
disesuaikan untuk kebutuhan KCP Sunter Permai._
