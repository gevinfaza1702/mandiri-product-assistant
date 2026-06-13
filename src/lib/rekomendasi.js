// ============================================================
//  REKOMENDASI PRODUK (RULE-BASED, BUKAN AI)
//  Alur form (meniru katalog referensi):
//    1. Kategori Kebutuhan  : pribadi / usaha
//    2. Tujuan Kebutuhan    : pilihan menyesuaikan kategori
//    3. Perkiraan Dana      : di bawah / di atas Rp500 juta
//    4. Profil Finansial    : opsional (mempengaruhi urutan hasil)
//  Aturannya transparan: setiap kombinasi mengembalikan daftar
//  KATA KUNCI nama produk berurutan dari yang paling sesuai.
// ============================================================

export const KATEGORI_KEBUTUHAN = [
  { value: 'pribadi', label: 'Kebutuhan Pribadi' },
  { value: 'usaha', label: 'Kebutuhan Usaha / Bisnis' },
]

// Tujuan kebutuhan per kategori (mengikuti produk yang ada di katalog).
export const TUJUAN = {
  pribadi: [
    'Menabung & Transaksi Harian',
    'Tabungan Anak / Pelajar',
    'Kartu Kredit / Cicilan Kebutuhan',
    'Sering Bepergian / Travelling',
    'Dana Tunai Konsumtif (Pendidikan, Renovasi, Pernikahan, dll.)',
    'Pembelian Rumah / Properti',
    'Pindah KPR / Top Up Properti',
    'Pembelian Kendaraan',
    'Pembayaran Tol, Parkir & Transportasi (Uang Elektronik)',
  ],
  usaha: [
    'Terima Pembayaran Nontunai (QRIS / Kasir / EDC)',
    'Modal Kerja / Modal Usaha',
    'Investasi / Ekspansi Usaha Besar',
    'Rekening Operasional Usaha',
    'Bayar Gaji Karyawan',
    'Transaksi Bisnis Besar (Cek / Bilyet Giro)',
    'Kartu Kredit Operasional Perusahaan',
  ],
}

export const DANA = [
  { value: 'below_500m', label: 'Di bawah Rp500 Juta' },
  { value: 'above_500m', label: 'Di atas Rp500 Juta' },
]

// Lama usaha berjalan (hanya tampil untuk kategori usaha) —
// menentukan kelayakan kredit: KUR minimal 6 bulan, KUM minimal 1 tahun.
export const LAMA_USAHA = [
  { value: 'baru', label: 'Di bawah 6 bulan' },
  { value: 'sedang', label: '6 bulan - 1 tahun' },
  { value: 'lama', label: 'Di atas 1 tahun' },
]

// Profil finansial & aset (opsional) — disesuaikan dengan syarat produk katalog.
export const PROFIL = [
  { key: 'penghasilanTinggi', label: 'Pendapatan per bulan di atas Rp10 Juta' },
  { key: 'punyaLegalitas', label: 'Memiliki legalitas badan usaha (NIB/SIUP/Akta Pendirian)' },
  { key: 'punyaRekening', label: 'Sudah memiliki rekening Bank Mandiri' },
  { key: 'punyaKaryawan', label: 'Memiliki karyawan yang perlu dibayar rutin' },
  { key: 'payrollMandiri', label: 'Nasabah adalah karyawan payroll Bank Mandiri' },
  { key: 'perluTerimaBayar', label: 'Usaha juga perlu terima pembayaran nontunai' },
]

// ------------------------------------------------------------
// ATURAN: kombinasi jawaban -> daftar kata kunci produk,
// urut dari yang PALING SESUAI (hasil pertama diberi badge).
// ------------------------------------------------------------
function aturanRekomendasi({
  kategori,
  tujuan,
  dana,
  lamaUsaha,
  penghasilanTinggi,
  punyaLegalitas,
  punyaRekening,
  punyaKaryawan,
  payrollMandiri,
  perluTerimaBayar,
}) {
  if (kategori === 'pribadi') {
    if (tujuan.startsWith('Menabung')) {
      // Sudah punya rekening -> arahkan ke kanal & produk pelengkap dulu.
      return punyaRekening
        ? ['livin by mandiri', 'e-money', 'tabungan now']
        : ['tabungan now', 'livin by mandiri', 'e-money']
    }
    if (tujuan.startsWith('Tabungan Anak')) {
      return ['simpel', 'tabungan now']
    }
    if (tujuan.startsWith('Kartu Kredit')) {
      // Penghasilan tinggi membuka kartu dengan limit & benefit lebih besar.
      return penghasilanTinggi
        ? ['mandiri platinum', 'mandiri signature', 'livin everyday']
        : ['livin everyday', 'mandiri platinum']
    }
    if (tujuan.startsWith('Sering Bepergian')) {
      return penghasilanTinggi
        ? ['mandiri signature', 'mandiri platinum', 'e-money']
        : ['mandiri platinum', 'livin everyday', 'e-money']
    }
    if (tujuan.startsWith('Dana Tunai')) {
      return payrollMandiri ? ['ksm', 'livin by mandiri'] : ['kredit multiguna', 'mandiri platinum', 'livin everyday']
    }
    if (tujuan.startsWith('Pembelian Rumah')) {
      return ['kpr mandiri', 'kpr take over', 'kredit multiguna']
    }
    if (tujuan.startsWith('Pindah KPR')) {
      return ['kpr take over', 'kredit multiguna', 'kpr mandiri']
    }
    if (tujuan.startsWith('Pembelian Kendaraan')) {
      return ['kredit kendaraan bermotor', 'livin by mandiri', 'e-money']
    }
    if (tujuan.startsWith('Pembayaran Tol')) {
      return ['e-money', 'livin by mandiri']
    }
  }

  if (kategori === 'usaha') {
    if (tujuan.startsWith('Terima Pembayaran')) {
      // Belum punya rekening -> QRIS butuh rekening, sertakan tabungan bisnis.
      return punyaRekening
        ? ['qris mandiri', 'livin merchant', 'edc mandiri']
        : ['qris mandiri', 'mandiri tabungan bisnis', 'livin merchant']
    }
    if (tujuan.startsWith('Modal Kerja')) {
      // Kelayakan kredit mengikuti lama usaha:
      //   < 6 bulan      -> belum layak KUR/KUM, bangun rekam jejak dulu
      //   6 bln - 1 thn  -> KUR (syarat minimal 6 bulan)
      //   > 1 tahun      -> KUR/KUM penuh, plafon menentukan urutan
      if (lamaUsaha === 'baru') {
        return perluTerimaBayar
          ? ['qris mandiri', 'livin merchant', 'mandiri tabungan bisnis']
          : ['mandiri tabungan bisnis', 'qris mandiri', 'livin merchant']
      }
      if (lamaUsaha === 'sedang') {
        return perluTerimaBayar ? ['kur', 'qris mandiri', 'livin merchant'] : ['kur', 'qris mandiri']
      }
      // KUR bersubsidi hanya sampai plafon Rp500 juta; di atas itu KUM.
      if (dana === 'above_500m') {
        return perluTerimaBayar
          ? ['kredit modal kerja', 'kredit investasi', 'qris mandiri']
          : ['kredit modal kerja', 'kredit investasi', 'kum']
      }
      return perluTerimaBayar ? ['kur', 'kum', 'qris mandiri'] : ['kur', 'kum']
    }
    if (tujuan.startsWith('Investasi')) {
      return dana === 'above_500m'
        ? ['kredit investasi', 'kredit modal kerja', 'mandiri giro']
        : ['kredit modal kerja', 'kum', 'mandiri tabungan bisnis']
    }
    if (tujuan.startsWith('Rekening Operasional')) {
      // Punya legalitas badan usaha -> bisa langsung diarahkan ke giro.
      if (perluTerimaBayar) {
        return punyaLegalitas
          ? ['mandiri tabungan bisnis', 'qris mandiri', 'mandiri giro']
          : ['mandiri tabungan bisnis', 'qris mandiri', 'tabungan now']
      }
      return punyaLegalitas ? ['mandiri tabungan bisnis', 'mandiri giro'] : ['mandiri tabungan bisnis', 'tabungan now']
    }
    if (tujuan.startsWith('Bayar Gaji')) {
      return punyaKaryawan
        ? ['mandiri payroll', 'mandiri tabungan bisnis', 'mandiri giro']
        : ['mandiri tabungan bisnis', 'mandiri giro']
    }
    if (tujuan.startsWith('Transaksi Bisnis Besar')) {
      return ['mandiri giro', 'mandiri tabungan bisnis']
    }
    if (tujuan.startsWith('Kartu Kredit Operasional')) {
      return ['mandiri sme card', 'mandiri giro']
    }
  }

  return []
}

// Samakan format nama agar pencocokan kata kunci tahan terhadap tanda baca.
function normalisasiNama(teks) {
  return teks
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Hitung rekomendasi: petakan kata kunci aturan ke produk katalog (maks. 3).
// Hasil pertama adalah yang paling sesuai.
export function hitungRekomendasi(produk, jawaban) {
  if (!jawaban.kategori || !jawaban.tujuan || !jawaban.dana) return []

  const kataKunci = aturanRekomendasi(jawaban)

  return kataKunci
    .map((kunci) =>
      produk.find((p) => normalisasiNama(p.nama_produk).includes(normalisasiNama(kunci))),
    )
    .filter(Boolean)
    .slice(0, 3)
}
