import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Quote,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  Users,
  FileText,
  Wallet,
  Presentation,
  Phone,
  Star,
  Share2,
  AlertCircle,
  ArrowRightLeft,
  Lightbulb,
  MessageSquare,
  Plus,
} from 'lucide-react'
import { useProduk } from '../lib/ProdukContext.jsx'
import { useFavorit } from '../lib/favorit.js'
import { linkWhatsApp, linkTelepon } from '../lib/util.js'
import { buatPanduanPitch, produkTerkait } from '../lib/pitch.js'
import { KATEGORI } from '../config/config.js'
import Header from '../components/Header.jsx'
import Icon from '../components/Icon.jsx'
import PitchCard from '../components/PitchCard.jsx'
import Loading from '../components/Loading.jsx'

// WhatsApp brand icon (lucide tidak punya, jadi pakai SVG inline sederhana).
function WaIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.299zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

// Satu blok seksi dengan judul + ikon (kartu putih gaya katalog).
function Seksi({ ikon: Ikon, judul, children }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
        <Ikon size={16} className="text-navy" />
        {judul}
      </h2>
      {children}
    </section>
  )
}

// Kartu "Hubungi PIC Sales" (sidebar kanan di desktop, bawah konten di mobile).
function KartuPic({ p }) {
  return (
    <div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900">Hubungi PIC Sales</h3>
        <div className="mb-4 mt-1.5 h-0.5 w-10 rounded-full bg-gold" />

        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-lg font-bold text-white">
            {p.pic_nama.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900">{p.pic_nama}</p>
            <p className="text-xs leading-snug text-gray-400">{p.pic_jabatan}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-[#25D366]">
              <WaIcon size={16} />
            </span>
            {p.pic_wa}
          </p>
          {p.pic_telp && (
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={15} className="text-gray-400" />
              {p.pic_telp}
            </p>
          )}
        </div>

        <a
          href={linkWhatsApp(p)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105 active:scale-[0.98]"
        >
          <WaIcon size={17} />
          Hubungi Sekarang
        </a>
      </div>

      <Link
        to="/"
        className="mt-4 flex items-center gap-1 px-1 text-sm text-gray-400 transition hover:text-navy"
      >
        <ChevronLeft size={15} />
        Kembali ke Beranda
      </Link>
    </div>
  )
}

export default function Detail() {
  const { id } = useParams()
  const { produk, loading } = useProduk()
  const { isFavorit, toggle } = useFavorit()
  const [pitch, setPitch] = useState(false) // toggle mode pitch card

  const p = useMemo(() => produk.find((x) => x.id === id), [produk, id])

  // Produk lain pada kategori yang sama (untuk sidebar kiri).
  const sekategori = useMemo(
    () => (p ? produk.filter((x) => x.kategori === p.kategori) : []),
    [produk, p],
  )
  const ikonKategori = KATEGORI.find((k) => k.nama === p?.kategori)?.ikon
  const panduanPitch = useMemo(() => (p ? buatPanduanPitch(p) : null), [p])
  const crossSell = useMemo(() => (p ? produkTerkait(p, produk) : []), [p, produk])

  if (loading) {
    return (
      <div className="min-h-screen bg-appbg">
        <Header back />
        <Loading />
      </div>
    )
  }

  // Produk tidak ditemukan (mis. id salah / data berubah).
  if (!p) {
    return (
      <div className="min-h-screen bg-appbg">
        <Header back />
        <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center gap-4 px-4 text-center text-gray-500">
          <AlertCircle size={40} className="text-amber-500" />
          <h1 className="text-xl font-bold text-gray-900">Produk tidak ditemukan</h1>
          <p className="text-sm">Produk yang Anda cari tidak tersedia atau sudah dinonaktifkan.</p>
          <Link
            to="/"
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-dark"
          >
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>
    )
  }

  // Bagikan link produk (P3): pakai Web Share API bila ada, jika tidak salin URL.
  const bagikan = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: p.nama_produk, text: p.highlight, url })
      } else {
        await navigator.clipboard.writeText(url)
        alert('Link produk disalin ke clipboard.')
      }
    } catch {
      /* dibatalkan pengguna — abaikan */
    }
  }

  return (
    <div className="min-h-screen bg-appbg pb-24 lg:pb-8">
      <Header
        back
        kanan={
          <div className="ml-1 flex items-center gap-1">
            <button
              onClick={bagikan}
              aria-label="Bagikan produk"
              className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition hover:bg-gray-100 active:scale-90"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => toggle(p.id)}
              aria-label="Favorit"
              className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition hover:bg-gray-100 active:scale-90"
            >
              <Star size={18} className={isFavorit(p.id) ? 'fill-gold text-gold' : ''} />
            </button>
          </div>
        }
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        {/* Breadcrumb: Beranda > Kategori > Produk */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-400">
          <Link to="/" className="transition-colors hover:text-navy">
            Beranda
          </Link>
          <ChevronRight size={14} />
          <Link
            to={`/kategori/${encodeURIComponent(p.kategori)}`}
            className="text-amber-700 transition-colors hover:text-navy"
          >
            {p.kategori}
          </Link>
          <ChevronRight size={14} />
          <span className="truncate font-medium text-gray-700">{p.nama_produk}</span>
        </nav>

        <div className="flex items-start gap-5">
          {/* ===== Sidebar kiri: produk sekategori (desktop saja) ===== */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-20 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {p.kategori}
              </p>
              <div className="space-y-0.5">
                {sekategori.map((x) => {
                  const aktif = x.id === p.id
                  return (
                    <Link
                      key={x.id}
                      to={`/produk/${x.id}`}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                        aktif
                          ? 'bg-blue-50 font-semibold text-navy'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          aktif ? 'bg-white text-navy' : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        <Icon name={ikonKategori} size={15} />
                      </span>
                      <span className="leading-snug">{x.nama_produk}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* ===== Kolom tengah: konten produk ===== */}
          <div className="min-w-0 flex-1 space-y-3">
            {/* Judul produk */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy">
                {p.kategori}
              </p>
              <h1 className="mt-0.5 text-xl font-extrabold leading-tight text-gray-900 sm:text-2xl">
                {p.nama_produk}
              </h1>
            </div>

            {/* HIGHLIGHT — paling menonjol di atas */}
            <div className="relative flex animate-fade-up gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-gold via-gold to-[#e8941a] p-5 text-white shadow-md">
              <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/15" />
              <Quote size={26} className="relative shrink-0 opacity-80" />
              <p className="relative text-lg font-bold leading-snug">{p.highlight}</p>
            </div>

            {/* Aksi cepat untuk pegawai */}
            <div className="grid gap-2 sm:grid-cols-3">
              <button
                onClick={() => setPitch(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white py-3 text-sm font-bold text-navy shadow-sm transition hover:border-amber-200 hover:shadow-md active:scale-[0.98]"
              >
                <Presentation size={18} />
                Pitch Card
              </button>
              <Link
                to={`/compare?a=${p.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white py-3 text-sm font-bold text-navy shadow-sm transition hover:border-amber-200 hover:shadow-md active:scale-[0.98]"
              >
                <ArrowRightLeft size={18} />
                Compare
              </Link>
              <Link
                to={`/prospek?produk=${p.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-3 text-sm font-bold text-white shadow-sm transition hover:bg-navy-dark active:scale-[0.98]"
              >
                <Plus size={18} />
                Simpan Prospek
              </Link>
            </div>

            {/* Deskripsi */}
            <Seksi ikon={FileText} judul="Deskripsi">
              <p className="text-sm leading-relaxed text-gray-600">{p.deskripsi_singkat}</p>
            </Seksi>

            {/* Script pitch & objection handling */}
            {panduanPitch && (
              <Seksi ikon={Presentation} judul="Script Pitch & Handling Objection">
                <div className="rounded-xl bg-amber-50 p-3 text-sm font-semibold leading-relaxed text-amber-900">
                  {panduanPitch.pembuka}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                      <Lightbulb size={14} className="text-gold" />
                      Cara menawarkan
                    </h3>
                    <ol className="space-y-2">
                      {panduanPitch.caraMenawarkan.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy/10 text-[11px] font-bold text-navy">
                            {i + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                      <MessageSquare size={14} className="text-navy" />
                      Jika nasabah keberatan
                    </h3>
                    <div className="space-y-2">
                      {panduanPitch.keberatan.map((item, i) => (
                        <div key={i} className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs font-bold text-gray-800">{item.tanya}</p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.jawab}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {crossSell.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Cross-sell yang cocok
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {crossSell.map((item) => (
                        <Link
                          key={item.id}
                          to={`/produk/${item.id}`}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-gold"
                        >
                          {item.nama_produk}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </Seksi>
            )}

            {/* Target nasabah + daftar kegunaan (jika ada) */}
            {(p.target_nasabah || p.kegunaan.length > 0) && (
              <Seksi ikon={Users} judul="Cocok untuk">
                {p.target_nasabah && (
                  <p className="text-sm leading-relaxed text-gray-600">{p.target_nasabah}</p>
                )}
                {p.kegunaan.length > 0 && (
                  <>
                    <p className="mb-2 mt-3 text-xs font-semibold text-gray-800">
                      Cocok untuk kebutuhan:
                    </p>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {p.kegunaan.map((k, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check
                            size={16}
                            className="mt-0.5 shrink-0 text-gold"
                            strokeWidth={2.5}
                          />
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Seksi>
            )}

            {/* Benefit sebagai checklist */}
            {p.benefit.length > 0 && (
              <Seksi ikon={CheckCircle2} judul="Keuntungan">
                <ul className="space-y-2">
                  {p.benefit.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Seksi>
            )}

            {/* Syarat utama */}
            {p.syarat_utama.length > 0 && (
              <Seksi ikon={FileText} judul="Syarat & Biaya">
                <ul className="space-y-2">
                  {p.syarat_utama.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy/40" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Seksi>
            )}

            {/* Cara pengajuan (langkah bernomor, jika ada) */}
            {p.cara_pengajuan.length > 0 && (
              <Seksi ikon={ClipboardList} judul="Cara Pengajuan">
                <ol className="space-y-2.5">
                  {p.cara_pengajuan.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy/10 text-[11px] font-bold text-navy">
                        {i + 1}
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ol>
              </Seksi>
            )}

            {/* Biaya / bunga / limit */}
            {p.biaya_bunga && (
              <Seksi ikon={Wallet} judul="Biaya / Bunga / Limit">
                <p className="text-sm leading-relaxed text-gray-600">{p.biaya_bunga}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">
                  Informasi internal untuk pegawai — verifikasi ketentuan terbaru sebelum
                  menawarkan ke nasabah.
                </p>
              </Seksi>
            )}

            {/* Kartu PIC versi mobile (di desktop pindah ke sidebar kanan) */}
            <div className="lg:hidden">
              <KartuPic p={p} />
            </div>
          </div>

          {/* ===== Sidebar kanan: kartu PIC (desktop saja) ===== */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-20">
              <KartuPic p={p} />
            </div>
          </aside>
        </div>
      </main>

      {/* Sticky bar bawah (mobile saja): tombol Hubungi PIC + telepon */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/90 backdrop-blur safe-bottom lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 sm:px-6">
          <a
            href={linkWhatsApp(p)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-base font-bold text-white shadow-lg transition hover:brightness-105 active:scale-[0.98]"
          >
            <WaIcon size={20} />
            Hubungi PIC
          </a>
          {p.pic_telp && (
            <a
              href={linkTelepon(p.pic_telp)}
              aria-label="Telepon PIC"
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-navy text-white transition hover:bg-navy-dark active:scale-95"
            >
              <Phone size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Overlay Pitch Card */}
      {pitch && <PitchCard produk={p} onClose={() => setPitch(false)} />}
    </div>
  )
}
