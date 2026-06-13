import Papa from 'papaparse'
import fallback from '../data/produk-fallback.json'
import { SHEET_CSV_URL } from '../config/config.js'

// ============================================================
//  LAPISAN DATA PRODUK
//  - Ambil CSV dari Google Spreadsheet (SHEET_CSV_URL)
//  - Parse dengan papaparse
//  - Normalisasi tiap baris jadi objek produk yang konsisten
//  - Jika gagal/offline/URL kosong => pakai data lokal (fallback JSON)
// ============================================================

// Ubah satu baris CSV/JSON mentah menjadi objek produk yang seragam.
// Field daftar (benefit, syarat_utama) dipisah dengan tanda "|".
function normalisasiProduk(row) {
  const pisah = (teks) =>
    (teks || '')
      .split('|')
      .map((x) => x.trim())
      .filter(Boolean)

  return {
    kategori: (row.kategori || 'Lainnya').trim(),
    nama_produk: (row.nama_produk || '').trim(),
    deskripsi_singkat: (row.deskripsi_singkat || '').trim(),
    target_nasabah: (row.target_nasabah || '').trim(),
    benefit: pisah(row.benefit),
    syarat_utama: pisah(row.syarat_utama),
    // Kolom opsional (boleh kosong di spreadsheet):
    kegunaan: pisah(row.kegunaan), // daftar "Cocok untuk kebutuhan"
    cara_pengajuan: pisah(row.cara_pengajuan), // langkah pengajuan berurutan
    highlight: (row.highlight || '').trim(),
    biaya_bunga: (row.biaya_bunga || '').trim(),
    pic_nama: (row.pic_nama || '').trim(),
    pic_jabatan: (row.pic_jabatan || '').trim(),
    pic_wa: (row.pic_wa || '').replace(/[^0-9]/g, ''), // sisakan angka saja
    pic_telp: (row.pic_telp || '').trim(),
    // urutan tampil; baris tanpa angka valid ditaruh paling belakang
    prioritas: Number.parseInt(row.prioritas, 10) || 999,
    aktif: (row.aktif || 'ya').trim().toLowerCase(),
    // id stabil untuk URL detail (slug dari nama produk)
    id: slugify(row.nama_produk || ''),
  }
}

// Buat slug URL-friendly dari nama produk, mis. "QRIS Mandiri" -> "qris-mandiri".
export function slugify(teks) {
  return teks
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Saring produk aktif lalu urutkan berdasar prioritas (kecil = atas).
function siapkan(daftar) {
  return daftar
    .map(normalisasiProduk)
    .filter((p) => p.nama_produk && p.aktif !== 'tidak')
    .sort((a, b) => a.prioritas - b.prioritas)
}

// Data lokal yang sudah dinormalisasi — dipakai sebagai fallback.
export function getDataFallback() {
  return siapkan(fallback)
}

// Ambil data produk. Mengembalikan { produk, offline }.
//   offline = true  -> sedang memakai data lokal (fetch gagal / URL kosong)
//   offline = false -> berhasil dari Google Spreadsheet
export async function ambilProduk() {
  // Tidak ada URL terpasang => langsung pakai fallback.
  if (!SHEET_CSV_URL) {
    return { produk: getDataFallback(), offline: true }
  }

  try {
    // Tambah parameter waktu agar tidak kena cache lama saat refresh manual.
    const url = `${SHEET_CSV_URL}${SHEET_CSV_URL.includes('?') ? '&' : '?'}_t=${Date.now()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const teksCsv = await res.text()

    // header:true -> baris pertama dipakai sebagai nama kolom.
    const hasil = Papa.parse(teksCsv, { header: true, skipEmptyLines: true })
    const produk = siapkan(hasil.data)

    // Jika spreadsheet kosong/format salah, jatuhkan ke fallback agar tidak blank.
    if (produk.length === 0) {
      return { produk: getDataFallback(), offline: true }
    }
    return { produk, offline: false }
  } catch (err) {
    // Offline atau URL bermasalah => pakai data lokal.
    console.warn('Gagal ambil data spreadsheet, memakai data lokal:', err.message)
    return { produk: getDataFallback(), offline: true }
  }
}
