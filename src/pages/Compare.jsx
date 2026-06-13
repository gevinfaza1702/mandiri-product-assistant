import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRightLeft, CheckCircle2, ChevronRight, FileText, Users, Wallet } from 'lucide-react'
import { useProduk } from '../lib/ProdukContext.jsx'
import Header from '../components/Header.jsx'
import Loading from '../components/Loading.jsx'
import DataFooter from '../components/DataFooter.jsx'

const PASANGAN_CEPAT = [
  { label: 'KUR vs KUM', kiri: 'kur', kanan: 'kum' },
  { label: 'QRIS vs EDC', kiri: 'qris', kanan: 'edc' },
  { label: 'TabBis vs Giro', kiri: 'tabungan bisnis', kanan: 'giro' },
  { label: 'Payroll vs KSM', kiri: 'payroll', kanan: 'ksm' },
  { label: 'NOW vs Livin', kiri: 'tabungan now', kanan: 'livin by mandiri' },
  { label: 'Platinum vs Signature', kiri: 'platinum', kanan: 'signature' },
  { label: 'KPR vs Take Over', kiri: 'kpr mandiri', kanan: 'kpr take over' },
  { label: 'Multiguna vs KSM', kiri: 'kredit multiguna', kanan: 'ksm' },
  { label: 'KMK vs Investasi', kiri: 'kredit modal kerja', kanan: 'kredit investasi' },
  { label: 'KPR vs KKB', kiri: 'kpr mandiri', kanan: 'kredit kendaraan bermotor' },
]

function normalisasi(teks) {
  return (teks || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function cariProduk(produk, kataKunci) {
  return produk.find((p) => normalisasi(p.nama_produk).includes(normalisasi(kataKunci)))
}

function PilihProduk({ label, produk, nilai, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-gray-700">{label}</span>
      <select
        value={nilai}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
      >
        <option value="">Pilih produk</option>
        {produk.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nama_produk}
          </option>
        ))}
      </select>
    </label>
  )
}

function RingkasanProduk({ produk }) {
  if (!produk) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-5 text-sm text-gray-400">
        Pilih produk untuk mulai membandingkan.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <span className="rounded-full bg-navy/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy">
        {produk.kategori}
      </span>
      <h2 className="mt-3 text-lg font-extrabold leading-tight text-gray-900">
        {produk.nama_produk}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        {produk.highlight || produk.deskripsi_singkat}
      </p>
      <Link
        to={`/produk/${produk.id}`}
        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-navy hover:underline"
      >
        Buka detail
        <ChevronRight size={13} strokeWidth={2.5} />
      </Link>
    </div>
  )
}

function KolomList({ items, kosong = '-' }) {
  if (!items?.length) return <p className="text-sm text-gray-400">{kosong}</p>
  return (
    <ul className="space-y-2">
      {items.slice(0, 5).map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-gray-600">
          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function BarisBanding({ ikon: Ikon, judul, kiri, kanan }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
        <Ikon size={16} className="text-navy" />
        {judul}
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-3">{kiri}</div>
        <div className="rounded-xl bg-gray-50 p-3">{kanan}</div>
      </div>
    </section>
  )
}

export default function Compare() {
  const { produk, loading } = useProduk()
  const [searchParams] = useSearchParams()
  const awalA = searchParams.get('a') || ''
  const awalB = searchParams.get('b') || ''
  const [kiriId, setKiriId] = useState(awalA)
  const [kananId, setKananId] = useState(awalB)

  const kiri = useMemo(() => produk.find((p) => p.id === kiriId), [produk, kiriId])
  const kanan = useMemo(() => produk.find((p) => p.id === kananId), [produk, kananId])

  const pilihPasangan = (pasangan) => {
    const a = cariProduk(produk, pasangan.kiri)
    const b = cariProduk(produk, pasangan.kanan)
    if (a) setKiriId(a.id)
    if (b) setKananId(b.id)
  }

  return (
    <div className="flex min-h-screen flex-col bg-appbg">
      <Header
        judul="Bandingkan Produk"
        subjudul="Bantu pegawai menjelaskan pilihan produk secara berdampingan"
        back
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {loading ? (
          <Loading />
        ) : (
          <div className="space-y-5">
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy/5 text-navy">
                  <ArrowRightLeft size={18} />
                </span>
                <div>
                  <h1 className="text-base font-extrabold text-gray-900">Pilih dua produk</h1>
                  <p className="text-xs text-gray-400">Gunakan quick pair atau pilih manual.</p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {PASANGAN_CEPAT.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => pilihPasangan(p)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-gold hover:text-navy"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
                <PilihProduk label="Produk pertama" produk={produk} nilai={kiriId} onChange={setKiriId} />
                <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-navy/5 text-navy lg:flex">
                  <ArrowRightLeft size={20} />
                </div>
                <PilihProduk
                  label="Produk kedua"
                  produk={produk}
                  nilai={kananId}
                  onChange={setKananId}
                />
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <RingkasanProduk produk={kiri} />
              <RingkasanProduk produk={kanan} />
            </div>

            {(kiri || kanan) && (
              <div className="space-y-3">
                <BarisBanding
                  ikon={Users}
                  judul="Cocok untuk"
                  kiri={<p className="text-sm leading-relaxed text-gray-600">{kiri?.target_nasabah || '-'}</p>}
                  kanan={<p className="text-sm leading-relaxed text-gray-600">{kanan?.target_nasabah || '-'}</p>}
                />
                <BarisBanding
                  ikon={CheckCircle2}
                  judul="Benefit utama"
                  kiri={<KolomList items={kiri?.benefit} />}
                  kanan={<KolomList items={kanan?.benefit} />}
                />
                <BarisBanding
                  ikon={FileText}
                  judul="Syarat utama"
                  kiri={<KolomList items={kiri?.syarat_utama} />}
                  kanan={<KolomList items={kanan?.syarat_utama} />}
                />
                <BarisBanding
                  ikon={Wallet}
                  judul="Biaya / bunga / limit"
                  kiri={
                    <p className="text-sm leading-relaxed text-gray-600">
                      {kiri?.biaya_bunga || '-'}
                    </p>
                  }
                  kanan={
                    <p className="text-sm leading-relaxed text-gray-600">
                      {kanan?.biaya_bunga || '-'}
                    </p>
                  }
                />
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 sm:p-5">
                  Informasi internal untuk pegawai. Biaya, bunga, limit, promo, dan kelayakan
                  harus diverifikasi ke PIC sebelum ditawarkan ke nasabah.
                </section>
              </div>
            )}
          </div>
        )}
      </main>

      <DataFooter />
    </div>
  )
}
