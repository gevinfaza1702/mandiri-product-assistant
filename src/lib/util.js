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
