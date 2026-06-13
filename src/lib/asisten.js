// ============================================================
//  KLIEN ASISTEN PRODUK (sisi browser)
//  - Meringkas katalog jadi teks padat sebagai konteks AI
//  - Memanggil endpoint internal /api/chat (key aman di server)
// ============================================================

import { labelStatus } from './prospek.js'

// Ubah seluruh katalog menjadi teks ringkas untuk konteks AI.
// Hanya data produk publik — TIDAK ADA data nasabah yang dikirim.
export function ringkasKatalog(produk) {
  return produk
    .map((p) => {
      const baris = [
        `PRODUK: ${p.nama_produk} (kategori: ${p.kategori})`,
        `Deskripsi: ${p.deskripsi_singkat}`,
        p.target_nasabah && `Cocok untuk: ${p.target_nasabah}`,
        p.kegunaan?.length > 0 && `Kegunaan: ${p.kegunaan.join('; ')}`,
        p.benefit?.length > 0 && `Keunggulan: ${p.benefit.join('; ')}`,
        p.syarat_utama?.length > 0 && `Syarat & biaya: ${p.syarat_utama.join('; ')}`,
        p.biaya_bunga && `Biaya/bunga/limit: ${p.biaya_bunga}`,
        p.pic_nama && `PIC: ${p.pic_nama} (${p.pic_jabatan})`,
      ]
      return baris.filter(Boolean).join('\n')
    })
    .join('\n\n---\n\n')
}

// Ringkas catatan prospek untuk konteks AI.
// PENTING: nomor HP nasabah SENGAJA tidak ikut dikirim (privasi) —
// asisten hanya tahu nama, produk, PIC, status, jadwal, dan catatan.
export function ringkasProspek(prospek, produk) {
  if (!prospek || prospek.length === 0) return ''
  const namaProduk = (id) => produk.find((p) => p.id === id)?.nama_produk || '-'

  return prospek
    .map((pr, i) => {
      const baris = [
        `${i + 1}. Nasabah: ${pr.nama}`,
        pr.produkId && `Produk diminati: ${namaProduk(pr.produkId)}`,
        pr.picNama && `PIC follow-up: ${pr.picNama}`,
        `Status: ${labelStatus(pr.status)}`,
        pr.tanggalFollowUp && `Jadwal follow-up: ${pr.tanggalFollowUp}`,
        pr.kebutuhan && `Kebutuhan: ${pr.kebutuhan}`,
        pr.catatan && `Catatan: ${pr.catatan}`,
        pr.dibuatPada && `Dicatat pada: ${pr.dibuatPada.slice(0, 10)}`,
      ]
      return baris.filter(Boolean).join(' | ')
    })
    .join('\n')
}

// Kirim percakapan ke endpoint internal. Mengembalikan { jawaban } atau { error }.
export async function tanyaAsisten(messages, katalog, prospek = '') {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, katalog, prospek }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { error: data.error || `Layanan asisten bermasalah (HTTP ${res.status}).` }
    }
    return { jawaban: data.jawaban }
  } catch {
    return { error: 'Tidak bisa terhubung ke layanan asisten. Periksa koneksi internet.' }
  }
}

// Pertanyaan pembuka yang bisa diklik langsung.
export const CONTOH_PERTANYAAN = [
  'Nasabah punya warung makan, belum punya rekening. Mulai dari produk apa?',
  'Apa bedanya KUR dan KUM? Kapan menawarkan yang mana?',
  'Pengelola venue olahraga butuh terima pembayaran & bayar gaji. Paket produknya apa saja?',
  'Berapa prospek yang dipegang tiap PIC, dan siapa yang perlu di-follow-up?',
]
