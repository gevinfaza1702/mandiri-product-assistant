import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowRightLeft,
  Bot,
  ClipboardList,
  ExternalLink,
  Headset,
  Layers3,
  SearchX,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useProduk } from '../lib/ProdukContext.jsx'
import { KATEGORI, EKSPLORASI, HERO_BANNERS, HERO_INTERVAL } from '../config/config.js'
import Header from '../components/Header.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Icon from '../components/Icon.jsx'
import ProdukCard from '../components/ProdukCard.jsx'
import DataFooter from '../components/DataFooter.jsx'
import Loading from '../components/Loading.jsx'
import { useFavorit } from '../lib/favorit.js'

function WaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.299zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-gold">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-extrabold leading-tight text-gray-950 sm:text-xl">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

function Metric({ icon: IconCmp, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy">
        <IconCmp size={18} />
      </span>
      <span>
        <span className="block text-lg font-extrabold leading-none text-gray-950">{value}</span>
        <span className="mt-1 block text-[11px] font-semibold text-gray-500">{label}</span>
      </span>
    </div>
  )
}

function ToolCard({ to, icon: IconCmp, eyebrow, title, description, tone = 'light' }) {
  const isGold = tone === 'gold'
  const isNavy = tone === 'navy'

  return (
    <Link
      to={to}
      className={`group flex min-h-[9rem] flex-col justify-between rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isGold
          ? 'border-gold bg-gold text-navy-dark'
          : isNavy
            ? 'border-navy bg-navy text-white'
            : 'border-gray-100 bg-white text-gray-950 hover:border-amber-200'
      }`}
    >
      <div>
        <span
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
            isGold
              ? 'bg-white/70 text-navy'
              : isNavy
                ? 'bg-white/10 text-gold'
                : 'bg-navy/5 text-navy'
          }`}
        >
          <IconCmp size={20} />
        </span>
        <p
          className={`text-[10px] font-extrabold uppercase tracking-widest ${
            isNavy ? 'text-white/60' : isGold ? 'text-navy/60' : 'text-gray-400'
          }`}
        >
          {eyebrow}
        </p>
        <h3 className="mt-1 text-base font-extrabold leading-snug">{title}</h3>
        <p
          className={`mt-1.5 text-xs leading-relaxed ${
            isNavy ? 'text-white/70' : isGold ? 'text-navy/70' : 'text-gray-500'
          }`}
        >
          {description}
        </p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold transition-all group-hover:gap-2">
        Buka
        <ArrowRight size={14} />
      </span>
    </Link>
  )
}

function CategoryCard({ kategori, jumlah, index }) {
  return (
    <Link
      to={`/kategori/${encodeURIComponent(kategori.nama)}`}
      className="group flex min-h-[8.25rem] animate-fade-up flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div>
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5 text-navy">
          <Icon name={kategori.ikon} size={20} />
        </span>
        <h3 className="text-base font-extrabold leading-snug text-gray-950">{kategori.nama}</h3>
        <p className="mt-1 text-xs font-semibold text-gray-400">{jumlah} produk tersedia</p>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-navy transition-all group-hover:gap-2">
        Lihat produk
        <ArrowRight size={14} />
      </span>
    </Link>
  )
}

// Penanda splash sudah tampil (level modul): splash hanya muncul sekali
// per buka/refresh web, tidak terulang saat kembali ke beranda dari halaman lain.
let splashSudahTampil = false

export default function Beranda() {
  const { produk, loading } = useProduk()
  const { isFavorit, toggle, favoritIds } = useFavorit()
  const [q, setQ] = useState('')

  // Splash loading saat web pertama dibuka (minimal 1,5 detik).
  const [splash, setSplash] = useState(() => !splashSudahTampil)
  useEffect(() => {
    if (!splash) return
    const timer = setTimeout(() => {
      splashSudahTampil = true
      setSplash(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [splash])

  const [banner, setBanner] = useState(0)
  useEffect(() => {
    if (HERO_BANNERS.length < 2) return
    const timer = setInterval(
      () => setBanner((b) => (b + 1) % HERO_BANNERS.length),
      HERO_INTERVAL,
    )
    return () => clearInterval(timer)
  }, [])

  const hasil = useMemo(() => {
    const kata = q.trim().toLowerCase()
    if (!kata) return null
    return produk.filter((p) =>
      [p.nama_produk, p.deskripsi_singkat, p.target_nasabah, p.kategori]
        .join(' ')
        .toLowerCase()
        .includes(kata),
    )
  }, [q, produk])

  const jumlahPerKategori = useMemo(() => {
    const m = {}
    for (const p of produk) m[p.kategori] = (m[p.kategori] || 0) + 1
    return m
  }, [produk])

  const kategoriAktif = useMemo(
    () => KATEGORI.filter((kat) => (jumlahPerKategori[kat.nama] || 0) > 0),
    [jumlahPerKategori],
  )

  const daftarPic = useMemo(() => {
    const m = new Map()
    for (const p of produk) {
      if (p.pic_wa && !m.has(p.pic_wa)) m.set(p.pic_wa, p)
    }
    return [...m.values()]
  }, [produk])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute inset-y-0 right-0 w-full lg:w-[64%]">
          {HERO_BANNERS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Bank Mandiri Banner"
              className={`absolute inset-0 h-full w-full object-cover object-[62%_center] transition-opacity duration-1000 lg:object-center ${
                i === banner ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-white from-[0%] via-white/85 via-[52%] to-white/10 lg:via-white/75 lg:via-[34%] lg:to-white/5" />
        </div>

        <div className="relative mx-auto grid min-h-[19rem] w-full max-w-7xl items-center px-4 py-9 sm:min-h-[24rem] sm:px-6 lg:min-h-[26rem] lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl lg:text-5xl">
              Solusi Funding &amp; Merchant untuk Setiap Nasabah
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Temukan produk tabungan, QRIS, kredit, dan payroll Bank Mandiri yang paling sesuai
              kebutuhan calon nasabah — siap dijelaskan di tempat.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/rekomendasi"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-navy-dark active:scale-[0.98]"
              >
                <Sparkles size={17} />
                Cari Rekomendasi
              </Link>
              <Link
                to="/prospek"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-navy shadow-sm transition hover:border-amber-200 active:scale-[0.98]"
              >
                <ClipboardList size={17} />
                Catat Prospek
              </Link>
            </div>

            <div className="mt-7 hidden gap-2 sm:grid sm:grid-cols-3">
              <Metric icon={Layers3} value={produk.length} label="Produk aktif" />
              <Metric icon={TrendingUp} value={kategoriAktif.length} label="Kategori" />
              <Metric icon={Star} value={favoritIds.length} label="Favorit" />
            </div>
          </div>

          {HERO_BANNERS.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 sm:right-6">
              {HERO_BANNERS.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setBanner(i)}
                  aria-label={`Banner ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === banner ? 'w-6 bg-navy' : 'w-2 bg-navy/25'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 sm:py-9">
        <section className="mb-8">
          <div className="mx-auto max-w-2xl">
            <SearchBar value={q} onChange={setQ} placeholder="Cari produk, kebutuhan, target, atau kategori..." />
          </div>
        </section>

        {loading || splash ? (
          <Loading teks="Menyiapkan katalog produk…" />
        ) : hasil ? (
          <section>
            <SectionHeader
              eyebrow="Pencarian"
              title={hasil.length > 0 ? 'Hasil ditemukan' : 'Tidak ada hasil'}
              description={`${hasil.length} produk ditemukan untuk "${q}"`}
            />
            {hasil.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-14 text-center text-gray-400 shadow-sm">
                <SearchX size={34} />
                <p className="text-sm">Coba kata kunci lain seperti QRIS, KUR, payroll, atau giro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {hasil.map((p, i) => (
                  <ProdukCard
                    key={p.id}
                    produk={p}
                    index={i}
                    isFavorit={isFavorit(p.id)}
                    onToggleFavorit={toggle}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <section>
              <SectionHeader
                eyebrow="Alat Kerja"
                title="Mulai dari kebutuhan nasabah"
                description="Pilih alur yang paling cepat untuk situasi di depan Anda."
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ToolCard
                  to="/rekomendasi"
                  icon={Sparkles}
                  eyebrow="Rekomendasi"
                  title="Cari produk terbaik"
                  description="Isi kebutuhan calon nasabah dan dapatkan urutan produk yang paling masuk akal."
                  tone="gold"
                />
                <ToolCard
                  to="/compare"
                  icon={ArrowRightLeft}
                  eyebrow="Compare"
                  title="Bandingkan produk"
                  description="Lihat perbedaan benefit, syarat, biaya, target, dan PIC secara berdampingan."
                />
                <ToolCard
                  to="/prospek"
                  icon={ClipboardList}
                  eyebrow="Follow-up"
                  title="Catatan prospek"
                  description="Simpan nama, kebutuhan, produk yang diminati, dan status tindak lanjut."
                />
                <ToolCard
                  to="/favorit"
                  icon={Star}
                  eyebrow="Akses cepat"
                  title="Produk favorit"
                  description={`${favoritIds.length} produk tersimpan untuk dibuka cepat saat pitching.`}
                  tone="navy"
                />
              </div>
            </section>

            <section className="mt-10">
              <SectionHeader
                eyebrow="Kategori"
                title="Telusuri katalog produk"
                description="Jumlah produk aktif otomatis mengikuti data spreadsheet atau fallback lokal."
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {kategoriAktif.map((kat, i) => (
                  <CategoryCard
                    key={kat.nama}
                    kategori={kat}
                    jumlah={jumlahPerKategori[kat.nama] || 0}
                    index={i}
                  />
                ))}
              </div>
            </section>

            <section className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_22rem]">
              <a
                href={EKSPLORASI.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[12rem] flex-col justify-between rounded-2xl bg-navy p-6 text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-navy-dark hover:shadow-lg sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-gold">
                    <Icon name="CreditCard" size={22} />
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-white transition group-hover:scale-105">
                    <ExternalLink size={16} />
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/55">
                    {EKSPLORASI.label}
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">{EKSPLORASI.judul}</h2>
                  <p className="mt-1 text-sm text-white/60">{EKSPLORASI.urlLabel}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-gold transition-all group-hover:gap-2">
                    Kunjungi sekarang
                    <ArrowRight size={14} />
                  </span>
                </div>
              </a>

              {daftarPic.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-gold">
                        PIC Sales
                      </p>
                      <h2 className="mt-1 text-base font-extrabold text-gray-950">Butuh bantuan?</h2>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5 text-navy">
                      <Headset size={19} />
                    </span>
                  </div>
                  <div className="space-y-2">
                    {daftarPic.map((p) => (
                      <a
                        key={p.pic_wa}
                        href={`https://wa.me/${p.pic_wa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5 transition hover:border-emerald-200 hover:bg-emerald-50"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white">
                          {p.pic_nama.charAt(0)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-gray-900">
                            {p.pic_nama}
                          </span>
                          <span className="block truncate text-[11px] text-gray-400">
                            {p.pic_jabatan}
                          </span>
                        </span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                          <WaIcon size={15} />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <DataFooter />

      {/* Tombol melayang Asisten Produk AI (pojok kanan bawah, ala widget chat) */}
      <Link
        to="/asisten"
        aria-label="Tanya Asisten Produk AI"
        className="group fixed bottom-5 right-4 z-40 flex items-center gap-0 rounded-full bg-gradient-to-br from-navy to-navy-dark text-white shadow-[0_8px_24px_-6px_rgba(0,63,135,0.5)] ring-1 ring-white/20 transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(0,63,135,0.6)] active:scale-95 sm:bottom-6 sm:right-6"
      >
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <Bot size={24} className="text-gold" />
          {/* Badge AI kecil */}
          <span className="absolute -right-0.5 -top-0.5 rounded-full bg-gold px-1.5 py-0.5 text-[8px] font-extrabold leading-none text-navy-dark shadow">
            AI
          </span>
        </span>
        {/* Label meluas saat hover (desktop) */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-extrabold transition-all duration-300 group-hover:max-w-[12rem] group-hover:pr-5">
          Tanya Asisten
        </span>
      </Link>
    </div>
  )
}
