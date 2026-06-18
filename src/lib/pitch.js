function normalisasi(teks) {
  return (teks || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function punya(produk, kata) {
  return normalisasi(produk.nama_produk).includes(kata)
}

function dasar(produk) {
  const benefitUtama = produk.benefit?.[0] || 'manfaatnya langsung terasa untuk kebutuhan nasabah'
  return {
    pembuka: `Pak/Bu, ${produk.nama_produk} bisa jadi pilihan karena ${normalisasiKalimat(benefitUtama)}.`,
    caraMenawarkan: [
      `Mulai dari kebutuhan nasabah, lalu hubungkan ke manfaat utama: ${produk.highlight || produk.deskripsi_singkat}`,
      'Tanyakan apakah nasabah sudah punya rekening Mandiri dan kanal digital yang aktif.',
      'Tutup dengan ajakan verifikasi syarat dan ketentuan terbaru ke PIC terkait.',
    ],
    keberatan: [
      {
        tanya: 'Nasabah ingin tahu biaya atau bunga pasti.',
        jawab:
          'Sampaikan bahwa angka mengikuti ketentuan terbaru. Jangan menyebut angka sebelum cek ke PIC/CSO/RM.',
      },
      {
        tanya: 'Nasabah ragu prosesnya lama.',
        jawab:
          'Tekankan bahwa pegawai cabang bisa bantu cek dokumen awal agar proses lebih rapi sejak awal.',
      },
    ],
    crossSellKeywords: ['livin by mandiri'],
  }
}

function normalisasiKalimat(teks) {
  if (!teks) return ''
  return teks.charAt(0).toLowerCase() + teks.slice(1)
}

export function buatPanduanPitch(produk) {
  const hasil = dasar(produk)

  if (punya(produk, 'qris')) {
    return {
      pembuka:
        'Pak/Bu, supaya pelanggan bisa bayar dari aplikasi apa saja, kita bisa bantu aktifkan QRIS Mandiri. Cukup satu QR di kasir, transaksi lebih rapi dan dana masuk ke rekening.',
      caraMenawarkan: [
        'Tanyakan apakah pelanggan sering minta bayar pakai QR atau transfer.',
        'Jelaskan bahwa QRIS cocok untuk warung, tenant kuliner, kios, dan UMKM yang ingin kasir lebih praktis.',
        'Arahkan nasabah menyiapkan rekening Mandiri, KTP, foto tempat usaha, dan data merchant.',
      ],
      keberatan: [
        {
          tanya: 'Takut biaya transaksi mahal.',
          jawab:
            'Sampaikan bahwa MDR mengikuti ketentuan QRIS terbaru dan harus diverifikasi ke PIC sebelum ditawarkan.',
        },
        {
          tanya: 'Sudah terbiasa menerima cash.',
          jawab:
            'Tekankan bahwa QRIS tidak mengganti cash, tapi menambah pilihan bayar untuk pelanggan yang jarang membawa uang tunai.',
        },
      ],
      crossSellKeywords: ['livin merchant', 'mandiri tabungan bisnis', 'edc mandiri'],
    }
  }

  if (punya(produk, 'livin merchant')) {
    return {
      pembuka:
        'Pak/Bu, kalau transaksi QRIS sudah mulai ramai, Livin Merchant membantu memantau omzet dan transaksi masuk langsung dari HP.',
      caraMenawarkan: [
        'Tanyakan apakah pemilik usaha butuh rekap transaksi harian tanpa cek manual.',
        'Tunjukkan manfaat pantau kasir/outlet dan notifikasi pembayaran berhasil.',
        'Pastikan status merchant QRIS dan rekening Mandiri aktif sebelum proses aktivasi.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah merasa cukup dengan QRIS biasa.',
          jawab:
            'Posisikan Livin Merchant sebagai alat pantau omzet, bukan sekadar alat menerima pembayaran.',
        },
        {
          tanya: 'Nasabah tidak terbiasa aplikasi kasir.',
          jawab:
            'Mulai dari fitur paling sederhana: lihat transaksi masuk dan rekap penjualan harian.',
        },
      ],
      crossSellKeywords: ['qris mandiri', 'edc mandiri', 'mandiri tabungan bisnis'],
    }
  }

  if (punya(produk, 'edc')) {
    return {
      pembuka:
        'Pak/Bu, kalau transaksi kartu makin sering atau nilainya besar, EDC Mandiri membuat kasir lebih siap menerima debit, kredit, dan contactless.',
      caraMenawarkan: [
        'Tanyakan apakah pelanggan sering bertanya pembayaran kartu debit atau kredit.',
        'Jelaskan bahwa EDC cocok untuk toko, restoran, klinik, dan usaha dengan volume transaksi lebih besar.',
        'Arahkan verifikasi biaya sewa/MDR dan dokumen merchant ke PIC.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah takut alat jarang dipakai.',
          jawab:
            'Sarankan mulai dari kebutuhan transaksi kartu yang sudah terlihat, bukan memaksa jika volume belum cukup.',
        },
        {
          tanya: 'Nasabah membandingkan dengan QRIS.',
          jawab:
            'Jelaskan bahwa QRIS cocok untuk pembayaran QR, sedangkan EDC melengkapi transaksi kartu dan contactless.',
        },
      ],
      crossSellKeywords: ['qris mandiri', 'livin merchant', 'mandiri tabungan bisnis'],
    }
  }

  // PENTING: cek "tabungan rencana" SEBELUM "mandiri tabungan",
  // karena nama MTR juga mengandung kata "mandiri tabungan".
  // MTR adalah tabungan BERJANGKA (terkunci) — bukan rekening transaksi harian.
  if (punya(produk, 'tabungan rencana')) {
    return {
      pembuka:
        'Pak/Bu, kalau ingin menabung disiplin untuk tujuan tertentu (pendidikan anak, ibadah, dana pensiun), Mandiri Tabungan Rencana menyisihkan dana otomatis tiap bulan lewat autodebet, plus perlindungan asuransi gratis.',
      caraMenawarkan: [
        'Tegaskan ini tabungan BERJANGKA: dana disetor rutin tiap bulan dan baru bisa diambil saat jatuh tempo, jadi benar-benar untuk menabung jangka panjang — bukan rekening transaksi harian.',
        'Pastikan nasabah sudah punya rekening sumber (Mandiri Tabungan atau Giro) untuk autodebet.',
        'Bantu nasabah menentukan tujuan, setoran bulanan (mulai Rp100.000), dan jangka waktu (1–20 tahun).',
      ],
      keberatan: [
        {
          tanya: 'Nasabah ingin dananya bisa diambil sewaktu-waktu.',
          jawab:
            'Jujur sampaikan bahwa MTR memang dikunci sampai jatuh tempo — justru itu kelebihannya agar tabungan tidak terpakai. Kalau nasabah butuh dana fleksibel, arahkan ke Mandiri Tabungan biasa.',
        },
        {
          tanya: 'Nasabah khawatir tidak sanggup setor rutin.',
          jawab:
            'Jelaskan setoran bisa dimulai dari Rp100.000 dan diubah sesuai kemampuan. Ingatkan bila gagal autodebet 3 kali berturut-turut, rekening MTR otomatis ditutup.',
        },
      ],
      crossSellKeywords: ['tabungan now', 'livin by mandiri'],
    }
  }

  if (punya(produk, 'tabungan now') || punya(produk, 'mandiri tabungan')) {
    return {
      pembuka:
        'Pak/Bu, rekening Mandiri Tabungan bisa jadi rekening utama untuk gaji, transfer, bayar, dan transaksi harian lewat Livin.',
      caraMenawarkan: [
        'Tanyakan apakah nasabah sudah punya rekening aktif untuk transaksi harian.',
        'Arahkan pembukaan online via Livin agar tidak perlu antre lama di cabang.',
        'Setelah rekening aktif, dorong aktivasi Livin dan produk pelengkap sesuai kebutuhan.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah malas datang ke cabang.',
          jawab:
            'Tekankan pembukaan bisa diarahkan online lewat Livin sesuai ketentuan yang berlaku.',
        },
        {
          tanya: 'Nasabah hanya butuh rekening sesekali.',
          jawab:
            'Jelaskan manfaat rekening aktif untuk transfer, pembayaran, top up, dan kebutuhan mendadak.',
        },
      ],
      crossSellKeywords: ['livin by mandiri', 'e-money'],
    }
  }

  if (punya(produk, 'simpel')) {
    return {
      pembuka:
        'Pak/Bu, Tabungan SimPel cocok untuk mengenalkan kebiasaan menabung sejak sekolah dengan setoran awal yang ringan.',
      caraMenawarkan: [
        'Tawarkan ke orang tua, sekolah, atau komunitas pendidikan sekitar cabang.',
        'Tekankan edukasi menabung dan administrasi yang sederhana sesuai ketentuan.',
        'Arahkan pengecekan dokumen pelajar, wali, dan sekolah ke CSO.',
      ],
      keberatan: [
        {
          tanya: 'Orang tua merasa anak belum perlu rekening.',
          jawab:
            'Jelaskan bahwa SimPel diposisikan sebagai latihan disiplin menabung, bukan hanya rekening transaksi.',
        },
        {
          tanya: 'Sekolah belum siap kerja sama.',
          jawab:
            'Mulai dari daftar minat dan kebutuhan administrasi, lalu koordinasikan ke CSO untuk tindak lanjut.',
        },
      ],
      crossSellKeywords: ['tabungan now', 'livin by mandiri'],
    }
  }

  if (punya(produk, 'e money')) {
    return {
      pembuka:
        'Pak/Bu, Mandiri e-Money praktis untuk tol, parkir, transportasi, dan kebutuhan mobilitas harian.',
      caraMenawarkan: [
        'Tawarkan sebagai add-on saat nasabah membuka rekening atau aktivasi Livin.',
        'Tanyakan apakah nasabah sering berkendara, parkir, atau menggunakan transportasi umum.',
        'Pastikan stok dan harga kartu terbaru ke CSO sebelum menawarkan.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah merasa sudah punya kartu uang elektronik lain.',
          jawab:
            'Posisikan sebagai kartu cadangan untuk mobilitas harian atau kebutuhan keluarga.',
        },
        {
          tanya: 'Nasabah bertanya stok dan harga.',
          jawab: 'Cek stok dan harga terbaru ke CSO sebelum memastikan ke nasabah.',
        },
      ],
      crossSellKeywords: ['livin by mandiri', 'tabungan now'],
    }
  }

  if (punya(produk, 'livin by mandiri')) {
    return {
      pembuka:
        'Pak/Bu, setelah rekening aktif, Livin by Mandiri membuat rekening langsung berguna untuk transfer, bayar, top up, dan transaksi harian dari HP.',
      caraMenawarkan: [
        'Arahkan Livin sebagai aktivasi wajib untuk nasabah baru atau dorman.',
        'Tanyakan transaksi harian yang paling sering dilakukan nasabah.',
        'Bantu pastikan nomor HP terdaftar dan perangkat siap untuk aktivasi.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah tidak terbiasa mobile banking.',
          jawab:
            'Mulai dari fitur paling mudah: cek saldo, transfer, dan bayar tagihan. Jangan langsung jelaskan semua fitur.',
        },
        {
          tanya: 'Nasabah khawatir keamanan.',
          jawab:
            'Jelaskan bahwa aktivasi mengikuti proses verifikasi dan nasabah harus menjaga PIN/OTP pribadi.',
        },
      ],
      crossSellKeywords: ['tabungan now', 'e-money'],
    }
  }

  if (punya(produk, 'kur')) {
    return {
      pembuka:
        'Pak/Bu, kalau usaha sudah berjalan dan butuh tambahan modal, KUR bisa jadi opsi pembiayaan produktif dengan skema subsidi pemerintah.',
      caraMenawarkan: [
        'Tanyakan lama usaha, kebutuhan modal, dan penggunaan dana.',
        'Pastikan nasabah punya dokumen usaha dasar seperti NIB atau surat keterangan usaha.',
        'Jangan menjanjikan approval; arahkan simulasi dan kelayakan ke Micro Banking Manager.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah ingin kepastian disetujui.',
          jawab:
            'Sampaikan bahwa tim mikro akan cek kelayakan, dokumen, dan ketentuan program terbaru terlebih dahulu.',
        },
        {
          tanya: 'Nasabah belum punya pencatatan usaha.',
          jawab:
            'Sarankan mulai merapikan transaksi lewat rekening usaha/QRIS agar rekam jejak usaha lebih jelas.',
        },
      ],
      crossSellKeywords: ['mandiri tabungan bisnis', 'qris mandiri', 'livin merchant'],
    }
  }

  if (punya(produk, 'kum')) {
    return {
      pembuka:
        'Pak/Bu, kalau kebutuhan usaha sudah di luar skema KUR, KUM bisa dibahas sebagai pembiayaan produktif yang lebih fleksibel.',
      caraMenawarkan: [
        'Gali kebutuhan limit, tenor, penggunaan dana, dan kesiapan dokumen usaha.',
        'Tanyakan apakah usaha sudah punya rekam transaksi dan legalitas yang rapi.',
        'Arahkan simulasi dan kebutuhan agunan ke Micro Banking Manager.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah ragu soal agunan.',
          jawab:
            'Jelaskan bahwa kebutuhan agunan mengikuti analisis kredit, jadi perlu dicek oleh tim mikro.',
        },
        {
          tanya: 'Nasabah membandingkan dengan KUR.',
          jawab:
            'Sampaikan bahwa KUR cocok jika masuk skema program, sedangkan KUM dibahas saat kebutuhan lebih fleksibel.',
        },
      ],
      crossSellKeywords: ['kur', 'mandiri tabungan bisnis', 'qris mandiri'],
    }
  }

  if (punya(produk, 'kredit modal kerja')) {
    return {
      pembuka:
        'Pak/Bu, kalau usaha butuh dana operasional berulang untuk stok, supplier, atau piutang dagang, Kredit Modal Kerja bisa dibahas sebagai fasilitas pembiayaan sesuai siklus usaha.',
      caraMenawarkan: [
        'Gali pola siklus usaha: kapan beli stok, kapan pembayaran pelanggan masuk, dan titik kas paling ketat.',
        'Tanyakan legalitas usaha, rekening koran, laporan keuangan, dan kebutuhan agunan.',
        'Arahkan analisis limit, bunga, dan biaya ke Relationship Manager sebelum memberi gambaran ke nasabah.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah belum punya laporan keuangan rapi.',
          jawab:
            'Sarankan mulai dari rekening bisnis dan mutasi transaksi yang jelas agar analisis kebutuhan modal lebih mudah.',
        },
        {
          tanya: 'Nasabah ingin kepastian limit.',
          jawab:
            'Sampaikan bahwa limit mengikuti analisis usaha, arus kas, agunan, dan kebijakan kredit terbaru.',
        },
      ],
      crossSellKeywords: ['mandiri tabungan bisnis', 'mandiri giro', 'qris mandiri'],
    }
  }

  if (punya(produk, 'kredit investasi')) {
    return {
      pembuka:
        'Pak/Bu, kalau rencana usahanya ekspansi seperti beli mesin, armada, perluasan pabrik, atau proyek baru, Kredit Investasi bisa dibahas sebagai pembiayaan jangka lebih panjang.',
      caraMenawarkan: [
        'Tanyakan tujuan investasi, estimasi kebutuhan dana, dan proyeksi dampaknya ke omzet atau efisiensi.',
        'Minta nasabah menyiapkan proposal, legalitas usaha, dokumen keuangan, dan dokumen agunan.',
        'Arahkan pembahasan limit, tenor, pencairan bertahap, dan biaya ke Relationship Manager.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah takut proses dokumen terlalu banyak.',
          jawab:
            'Jelaskan bahwa pembiayaan investasi memang perlu dokumen lebih rapi karena nilainya terkait proyek dan agunan.',
        },
        {
          tanya: 'Nasabah belum yakin memilih KMK atau Investasi.',
          jawab:
            'KMK untuk kebutuhan modal kerja berulang, sedangkan Kredit Investasi untuk barang modal/proyek jangka panjang.',
        },
      ],
      crossSellKeywords: ['kredit modal kerja', 'mandiri giro', 'mandiri tabungan bisnis'],
    }
  }

  if (punya(produk, 'kpr mandiri')) {
    return {
      pembuka:
        'Pak/Bu, kalau sedang mencari rumah, apartemen, ruko, atau properti second, KPR Mandiri bisa dibahas sebagai pembiayaan properti dengan program yang fleksibel.',
      caraMenawarkan: [
        'Tanyakan jenis properti, status developer/second, perkiraan harga, dan sumber penghasilan nasabah.',
        'Jelaskan bahwa program bunga, DP, tenor, dan biaya harus dicek sesuai periode promo terbaru.',
        'Arahkan nasabah menyiapkan identitas, bukti penghasilan, rekening koran, dan dokumen properti.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah minta simulasi cicilan pasti.',
          jawab:
            'Berikan arahan bahwa simulasi perlu dihitung dengan program bunga terbaru dan data penghasilan nasabah.',
        },
        {
          tanya: 'Nasabah belum punya properti pilihan.',
          jawab:
            'Bantu mulai dari cek kemampuan awal dan arahkan ke developer/kanal properti yang bekerja sama.',
        },
      ],
      crossSellKeywords: ['kpr take over', 'kredit multiguna', 'livin by mandiri'],
    }
  }

  if (punya(produk, 'kpr take over')) {
    return {
      pembuka:
        'Pak/Bu, kalau KPR di bank lain terasa berat atau ingin opsi top up, KPR Take Over Mandiri bisa dibahas untuk memindahkan fasilitas ke Mandiri.',
      caraMenawarkan: [
        'Tanyakan bank asal, sisa outstanding, histori pembayaran, dan kebutuhan top up bila ada.',
        'Minta dokumen agunan, bukti mutasi pembayaran, dan data penghasilan untuk pengecekan awal.',
        'Arahkan simulasi bunga, tenor, top up, dan biaya take over ke PIC KPR.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah khawatir biaya pindah bank.',
          jawab:
            'Sampaikan bahwa biaya take over perlu dihitung bersama potensi penghematan cicilan sebelum diputuskan.',
        },
        {
          tanya: 'Nasabah punya histori pembayaran kurang lancar.',
          jawab:
            'Jelaskan bahwa histori pembayaran menjadi bagian penting analisis dan perlu dicek ke PIC.',
        },
      ],
      crossSellKeywords: ['kpr mandiri', 'kredit multiguna'],
    }
  }

  if (punya(produk, 'kredit multiguna')) {
    return {
      pembuka:
        'Pak/Bu, kalau sudah punya properti dan butuh dana tunai besar untuk kebutuhan konsumtif, Kredit Multiguna bisa dibahas dengan agunan properti.',
      caraMenawarkan: [
        'Tanyakan kebutuhan dana, status sertifikat properti, dan kemampuan pembayaran bulanan.',
        'Jelaskan bahwa limit sangat bergantung pada nilai agunan dan analisis kredit.',
        'Arahkan pengecekan dokumen agunan, biaya, tenor, dan bunga ke Sales Generalist Konsumtif.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah takut sertifikat dijaminkan.',
          jawab:
            'Jelaskan mekanismenya secara hati-hati dan arahkan nasabah memahami risiko serta kewajiban cicilan.',
        },
        {
          tanya: 'Nasabah bertanya bedanya dengan KSM.',
          jawab:
            'KSM cocok untuk karyawan payroll tanpa agunan, sedangkan Multiguna memakai agunan properti untuk kebutuhan dana lebih besar.',
        },
      ],
      crossSellKeywords: ['ksm', 'kpr take over', 'livin by mandiri'],
    }
  }

  if (punya(produk, 'kredit kendaraan')) {
    return {
      pembuka:
        'Pak/Bu, kalau ingin beli kendaraan baru/bekas atau butuh dana dengan agunan BPKB, Kredit Kendaraan Bermotor Mandiri bisa dibahas sesuai program berjalan.',
      caraMenawarkan: [
        'Tanyakan jenis kendaraan, baru/bekas, dealer, dan estimasi kemampuan angsuran.',
        'Jelaskan bahwa bunga, DP, tenor, dan biaya mengikuti program terbaru dari kanal pembiayaan kendaraan.',
        'Arahkan simulasi dan dokumen ke Sales Generalist Konsumtif sebelum memberi angka ke nasabah.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah ingin DP atau bunga paling rendah.',
          jawab:
            'Sampaikan bahwa promo berubah sesuai periode, dealer, dan profil nasabah, jadi perlu verifikasi dulu.',
        },
        {
          tanya: 'Nasabah belum menentukan unit kendaraan.',
          jawab:
            'Bantu mulai dari kisaran budget dan kebutuhan kendaraan, lalu cek opsi pembiayaan setelah unit lebih jelas.',
        },
      ],
      crossSellKeywords: ['livin by mandiri', 'e-money', 'kredit multiguna'],
    }
  }

  if (punya(produk, 'payroll')) {
    return {
      pembuka:
        'Pak/Bu, Mandiri Payroll membantu pembayaran gaji karyawan jadi lebih rapi, terpusat, dan membuka akses benefit untuk karyawan.',
      caraMenawarkan: [
        'Tanyakan jumlah karyawan, frekuensi gaji, dan proses payroll saat ini.',
        'Tekankan efisiensi administrasi HR dan potensi pembukaan rekening massal.',
        'Arahkan kebutuhan dokumen dan paket kerja sama ke Relationship Manager.',
      ],
      keberatan: [
        {
          tanya: 'Perusahaan merasa proses payroll lama dipindahkan.',
          jawab:
            'Mulai dari pemetaan data karyawan dan rekening, lalu jadwalkan implementasi bertahap dengan RM.',
        },
        {
          tanya: 'Perusahaan sudah punya bank payroll lain.',
          jawab:
            'Cari pain point: biaya, laporan, akses karyawan, atau benefit pembiayaan seperti KSM.',
        },
      ],
      crossSellKeywords: ['ksm', 'mandiri tabungan bisnis', 'mandiri giro'],
    }
  }

  if (punya(produk, 'ksm')) {
    return {
      pembuka:
        'Pak/Bu, untuk karyawan payroll Mandiri yang butuh dana multiguna, KSM bisa dibahas karena cicilan lebih mudah dikelola lewat mekanisme payroll.',
      caraMenawarkan: [
        'Pastikan nasabah adalah karyawan payroll Mandiri atau perusahaan payroll existing.',
        'Tanyakan kebutuhan dana dan kemampuan angsuran secara hati-hati.',
        'Arahkan cek limit, tenor, bunga, dan kelayakan ke PIC terkait.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah takut cicilan memberatkan.',
          jawab:
            'Sarankan simulasi konservatif sesuai penghasilan dan jangan mendorong limit di luar kebutuhan.',
        },
        {
          tanya: 'Nasabah bukan payroll Mandiri.',
          jawab:
            'Sampaikan bahwa KSM sangat terkait payroll; cek alternatif atau eligibility terbaru ke PIC.',
        },
      ],
      crossSellKeywords: ['mandiri payroll', 'livin by mandiri'],
    }
  }

  if (punya(produk, 'tabungan bisnis')) {
    return {
      pembuka:
        'Pak/Bu, Mandiri Tabungan Bisnis membantu memisahkan uang pribadi dan uang usaha supaya arus kas lebih rapi.',
      caraMenawarkan: [
        'Tanyakan apakah transaksi usaha masih bercampur dengan rekening pribadi.',
        'Hubungkan rekening bisnis dengan kebutuhan QRIS, EDC, payroll, atau transaksi vendor.',
        'Arahkan pengecekan dokumen usaha ke Relationship Manager.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah merasa rekening pribadi sudah cukup.',
          jawab:
            'Jelaskan bahwa rekening bisnis memudahkan pencatatan, settlement usaha, dan evaluasi arus kas.',
        },
        {
          tanya: 'Nasabah belum punya legalitas lengkap.',
          jawab:
            'Mulai dari dokumen yang tersedia, lalu cek opsi dan persyaratan terbaru ke RM.',
        },
      ],
      crossSellKeywords: ['qris mandiri', 'mandiri giro', 'mandiri payroll'],
    }
  }

  if (punya(produk, 'giro')) {
    return {
      pembuka:
        'Pak/Bu, Mandiri Giro cocok untuk bisnis yang punya transaksi formal, pembayaran vendor, atau kebutuhan cek dan bilyet giro.',
      caraMenawarkan: [
        'Tanyakan volume transaksi, kebutuhan pembayaran vendor, dan legalitas badan usaha.',
        'Bedakan dengan tabungan bisnis: giro lebih cocok untuk transaksi formal perusahaan.',
        'Arahkan proses KYC dan kelengkapan dokumen ke Relationship Manager.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah belum butuh cek atau bilyet giro.',
          jawab:
            'Sarankan Tabungan Bisnis dulu jika transaksi masih sederhana, lalu naik ke Giro saat kebutuhan formal meningkat.',
        },
        {
          tanya: 'Nasabah menanyakan biaya warkat dan jasa giro.',
          jawab:
            'Sampaikan bahwa semua biaya dan jasa giro harus diverifikasi ke RM sebelum ditawarkan.',
        },
      ],
      crossSellKeywords: ['mandiri tabungan bisnis', 'mandiri payroll', 'mandiri sme card'],
    }
  }

  if (produk.kategori === 'Kartu Kredit') {
    return {
      pembuka: `Pak/Bu, ${produk.nama_produk} bisa membantu transaksi pribadi atau bisnis lebih fleksibel, dengan kontrol tagihan dan fitur cicilan sesuai ketentuan.`,
      caraMenawarkan: [
        'Tanyakan kebutuhan utama: transaksi harian, travel, cicilan, atau operasional perusahaan.',
        'Pastikan nasabah memahami bahwa limit, iuran, bunga, dan approval mengikuti hasil verifikasi.',
        'Arahkan pengajuan dan dokumen pendukung ke PIC kartu kredit.',
      ],
      keberatan: [
        {
          tanya: 'Nasabah takut bunga dan iuran.',
          jawab:
            'Jelaskan manfaat kartu sesuai kebutuhan, lalu verifikasi bunga, iuran, promo, dan limit terbaru ke PIC.',
        },
        {
          tanya: 'Nasabah khawatir approval tidak lolos.',
          jawab:
            'Sampaikan bahwa pengajuan tetap melalui analisis dan pengecekan dokumen, tanpa menjanjikan persetujuan.',
        },
      ],
      crossSellKeywords: ['livin by mandiri', 'tabungan now'],
    }
  }

  return hasil
}

export function produkTerkait(produk, semuaProduk) {
  const panduan = buatPanduanPitch(produk)
  return panduan.crossSellKeywords
    .map((kunci) => semuaProduk.find((p) => normalisasi(p.nama_produk).includes(normalisasi(kunci))))
    .filter(Boolean)
    .filter((p) => p.id !== produk.id)
    .slice(0, 3)
}
