import { useState, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Send,
  Bot,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  UserRound,
} from 'lucide-react'
import { useProduk } from '../lib/ProdukContext.jsx'
import { useProspek } from '../lib/prospek.js'
import { ringkasKatalog, ringkasProspek, tanyaAsisten, CONTOH_PERTANYAAN } from '../lib/asisten.js'
import Header from '../components/Header.jsx'
import Loading from '../components/Loading.jsx'
import DataFooter from '../components/DataFooter.jsx'

// Render teks jawaban: dukung baris baru & poin sederhana tanpa library markdown.
function TeksJawaban({ teks }) {
  return (
    <div className="space-y-1.5">
      {teks.split('\n').map((baris, i) => {
        const t = baris.trim()
        if (!t) return null
        const isPoin = /^[-*•]\s+/.test(t) || /^\d+[.)]\s+/.test(t)
        return (
          <p key={i} className={`text-sm leading-relaxed ${isPoin ? 'pl-3' : ''}`}>
            {t.replace(/\*\*/g, '')}
          </p>
        )
      })}
    </div>
  )
}

// Satu gelembung chat.
function Gelembung({ role, children }) {
  const user = role === 'user'
  return (
    <div className={`flex items-end gap-2 ${user ? 'justify-end' : 'justify-start'}`}>
      {!user && (
        <span className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
          <Bot size={16} />
        </span>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
          user
            ? 'rounded-br-md bg-navy text-white'
            : 'rounded-bl-md border border-gray-100 bg-white text-gray-700 shadow-sm'
        }`}
      >
        {children}
      </div>
      {user && (
        <span className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-navy">
          <UserRound size={16} />
        </span>
      )}
    </div>
  )
}

// Indikator "sedang mengetik" (tiga titik memantul).
function Mengetik() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/40"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

// Halaman Asisten Produk: chat tanya-jawab yang di-ground ke data katalog.
export default function Asisten() {
  const { produk, loading } = useProduk()
  const { prospek } = useProspek()
  const [pesan, setPesan] = useState([]) // { role: 'user'|'assistant', content }
  const [input, setInput] = useState('')
  const [berpikir, setBerpikir] = useState(false)
  const [error, setError] = useState(null)
  const ujungRef = useRef(null)

  // Konteks katalog & prospek dihitung ulang saat datanya berubah.
  // Catatan: ringkasProspek TIDAK menyertakan nomor HP nasabah (privasi).
  const katalog = useMemo(() => ringkasKatalog(produk), [produk])
  const konteksProspek = useMemo(() => ringkasProspek(prospek, produk), [prospek, produk])

  // Selalu gulir ke pesan terbaru.
  useEffect(() => {
    ujungRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [pesan, berpikir])

  const kirim = async (teks) => {
    const pertanyaan = (teks ?? input).trim()
    if (!pertanyaan || berpikir) return

    const riwayatBaru = [...pesan, { role: 'user', content: pertanyaan }]
    setPesan(riwayatBaru)
    setInput('')
    setError(null)
    setBerpikir(true)

    const hasil = await tanyaAsisten(riwayatBaru, katalog, konteksProspek)
    setBerpikir(false)

    if (hasil.error) {
      setError(hasil.error)
    } else {
      setPesan([...riwayatBaru, { role: 'assistant', content: hasil.jawaban }])
    }
  }

  const reset = () => {
    setPesan([])
    setError(null)
    setInput('')
  }

  return (
    <div className="flex min-h-screen flex-col bg-appbg">
      <Header back />

      {/* Blok judul + breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
            <Link to="/" className="hover:text-navy">
              Beranda
            </Link>
            <ChevronRight size={13} />
            <span className="font-semibold text-navy">Asisten Produk</span>
          </nav>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 sm:text-2xl">
                Asisten Produk
                <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-navy-dark">
                  AI
                </span>
              </h1>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Tanya apa saja seputar produk di katalog — jawaban dirangkum dari data katalog
                cabang.
              </p>
            </div>
            {pesan.length > 0 && (
              <button
                onClick={reset}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-navy hover:text-navy"
              >
                <RotateCcw size={13} />
                Mulai Ulang
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-5 sm:px-6">
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Area percakapan */}
            <div className="flex-1 space-y-4 pb-4">
              {pesan.length === 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold">
                    <Bot size={26} />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">
                    Halo! Saya siap bantu jelaskan produk.
                  </h2>
                  <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-gray-400">
                    Tanyakan kebutuhan calon nasabah, perbandingan produk, atau syarat — saya
                    jawab berdasarkan {produk.length} produk di katalog.
                  </p>

                  {/* Contoh pertanyaan yang bisa diklik */}
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {CONTOH_PERTANYAAN.map((c) => (
                      <button
                        key={c}
                        onClick={() => kirim(c)}
                        className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-xs text-gray-600 transition hover:border-gold hover:bg-amber-50"
                      >
                        <Sparkles size={13} className="mt-0.5 shrink-0 text-gold" />
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pesan.map((m, i) => (
                <Gelembung key={i} role={m.role}>
                  {m.role === 'assistant' ? (
                    <TeksJawaban teks={m.content} />
                  ) : (
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  )}
                </Gelembung>
              ))}

              {berpikir && (
                <Gelembung role="assistant">
                  <Mengetik />
                </Gelembung>
              )}

              {/* Error + fallback anggun: arahkan ke fitur non-AI */}
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  <div className="text-xs leading-relaxed text-amber-800">
                    <p className="font-bold">Asisten sedang tidak tersedia.</p>
                    <p className="mt-0.5">{error}</p>
                    <p className="mt-1.5">
                      Sementara itu, gunakan{' '}
                      <Link to="/rekomendasi" className="font-bold underline">
                        Rekomendasi
                      </Link>{' '}
                      atau hubungi PIC langsung dari halaman produk.
                    </p>
                  </div>
                </div>
              )}

              <div ref={ujungRef} />
            </div>

            {/* Kotak input (menempel bawah area chat) */}
            <div className="sticky bottom-0 -mx-4 border-t border-gray-100 bg-appbg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 safe-bottom">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  kirim()
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      kirim()
                    }
                  }}
                  rows={1}
                  placeholder="Tulis pertanyaan… (mis. produk untuk tenant F&B baru)"
                  className="max-h-32 min-h-[46px] flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || berpikir}
                  aria-label="Kirim pertanyaan"
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-navy text-white transition hover:bg-navy-dark active:scale-95 disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-gray-400">
                Jawaban dihasilkan AI dari data katalog — selalu verifikasi detail terbaru ke PIC
                produk.
              </p>
            </div>
          </>
        )}
      </main>

      <DataFooter />
    </div>
  )
}
