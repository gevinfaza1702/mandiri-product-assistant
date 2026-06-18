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

// Format angka jadi "Rp 200.000.000". Mengembalikan '' jika kosong/invalid.
export function formatRupiah(nominal) {
  const angka = Number(nominal)
  if (!nominal || Number.isNaN(angka)) return ''
  return `Rp ${angka.toLocaleString('id-ID')}`
}

// Unduh data tabular (array of object) sebagai file Excel (.xlsx).
//   namaFile : nama file unduhan (mis. "prospek-2026-06-18.xlsx")
//   baris    : array objek data
//   kolom    : array { key, label } — label jadi header, key mengambil nilai
//   namaSheet: nama tab sheet (opsional)
// Library xlsx di-import dinamis (lazy) agar tidak membebani bundle awal —
// hanya diunduh browser saat fitur export benar-benar dipakai.
export async function unduhExcel(namaFile, baris, kolom, namaSheet = 'Data') {
  const XLSX = await import('xlsx')

  // Susun array-of-array: baris pertama header, sisanya isi.
  const aoa = [
    kolom.map((k) => k.label),
    ...baris.map((row) =>
      kolom.map((k) => {
        const v = row[k.key]
        return v === null || v === undefined ? '' : v
      }),
    ),
  ]

  const ws = XLSX.utils.aoa_to_sheet(aoa)

  // Lebar kolom otomatis: ikuti teks terpanjang (header atau isi), dibatasi.
  ws['!cols'] = kolom.map((k) => {
    const panjangIsi = baris.map((row) => String(row[k.key] ?? '').length)
    const maks = Math.max(k.label.length, ...panjangIsi, 8)
    return { wch: Math.min(maks + 2, 50) }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, namaSheet)
  XLSX.writeFile(wb, namaFile)
}
