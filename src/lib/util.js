import { NAMA_CABANG } from '../config/config.js'

// ============================================================
//  KUMPULAN FUNGSI BANTU
// ============================================================

// Bentuk link WhatsApp (wa.me) berisi template pesan ke PIC produk.
// pegawai = nama pegawai yang sedang memitch (opsional, default generik).
export function linkWhatsApp(produk, pegawai) {
  const namaPegawai = pegawai && pegawai.trim() ? pegawai.trim() : 'pegawai'
  const pesan =
    `Halo Pak/Bu ${produk.pic_nama}, saya ${namaPegawai} dari ${NAMA_CABANG}, ` +
    `ada calon nasabah tertarik dengan produk ${produk.nama_produk}. ` +
    `Mohon bantuannya untuk proses lebih lanjut. Terima kasih.`
  return `https://wa.me/${produk.pic_wa}?text=${encodeURIComponent(pesan)}`
}

// Bentuk link telepon. Hilangkan spasi/strip agar valid di tel:.
export function linkTelepon(nomor) {
  return `tel:${(nomor || '').replace(/[^0-9+]/g, '')}`
}

// Format waktu fetch jadi "11 Jun 2026, 14.53" (locale Indonesia).
export function formatWaktu(tanggal) {
  if (!tanggal) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(tanggal)
}

// Unduh data tabular (array of object) sebagai file CSV.
export function unduhCsv(namaFile, baris, kolom) {
  const escape = (nilai) => {
    const teks = nilai === null || nilai === undefined ? '' : String(nilai)
    if (/[",\n]/.test(teks)) return `"${teks.replace(/"/g, '""')}"`
    return teks
  }

  const header = kolom.map((k) => escape(k.label)).join(',')
  const isi = baris.map((row) => kolom.map((k) => escape(row[k.key])).join(','))
  const csv = [header, ...isi].join('\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = namaFile
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
