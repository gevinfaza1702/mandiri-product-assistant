// ============================================================
//  KONFIGURASI APLIKASI — ubah di sini, tidak perlu sentuh kode lain
// ============================================================

// URL Google Spreadsheet yang DI-PUBLISH sebagai CSV.
// Cara membuatnya ada di README.md (File > Share > Publish to web > pilih CSV).
// Jika URL ini kosong / gagal di-fetch, aplikasi otomatis memakai data lokal
// (src/data/produk-fallback.json) dan menampilkan tanda "data offline".
//
// Contoh format URL:
// https://docs.google.com/spreadsheets/d/e/XXXXXXXX/pub?gid=0&single=true&output=csv
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkM9MNvxzDmj9psN3AjymPG9sp4SICc6mHiAF2DXvb56HD2NjgY2C363FZuTEi5gTmHwtAsi4SB_OG/pub?gid=98676883&single=true&output=csv'

// Identitas pegawai yang dipakai pada template pesan WhatsApp ke PIC.
// Ganti sesuai nama pegawai (atau nanti bisa dibuat input — lihat README).
export const NAMA_CABANG = 'KCP Sunter Permai'

// Daftar kategori beserta urutan tampil & ikon (nama ikon dari lucide-react).
export const KATEGORI = [
  { nama: 'Merchant & QRIS', ikon: 'QrCode' },
  { nama: "Tabungan & Livin'", ikon: 'PiggyBank' },
  { nama: 'Kredit UMKM', ikon: 'Store' },
  { nama: 'Kredit Retail', ikon: 'HandCoins' },
  { nama: 'Payroll & Korporasi', ikon: 'Building2' },
  { nama: 'Rekening Badan', ikon: 'Landmark' },
  { nama: 'Kartu Kredit', ikon: 'CreditCard' },
  { nama: 'Lainnya', ikon: 'LayoutGrid' },
]

// Gambar hero di beranda — berganti otomatis sesuai interval (ms).
// Tambahkan file gambar ke folder public/ lalu daftarkan path-nya di sini.
export const HERO_BANNERS = ['/banner-hero.jpeg', '/livinbymandiri.png', '/banner-hero2.png']
export const HERO_INTERVAL = 20000 // 20 detik

// Banner eksplorasi di beranda: tautan ke situs resmi kartu kredit Mandiri.
export const EKSPLORASI = {
  label: 'Eksplorasi',
  judul: 'Kartu Kredit Mandiri',
  url: 'https://www.mandirikartukredit.com',
  urlLabel: 'mandirikartukredit.com',
}

// Panel showcase di beranda (gaya katalog): menonjolkan satu kategori unggulan.
// Produk yang tampil = semua produk pada kategori ini (maksimal 3).
export const SHOWCASE = {
  kategori: 'Rekening Badan',
  badge: 'Rekening Badan',
  judul: 'Kelola Keuangan Bisnis Lebih Mudah & Aman',
  deskripsi:
    'Solusi rekening untuk mendukung aktivitas bisnis perusahaan Anda dengan fitur lengkap dan kemudahan transaksi.',
}
