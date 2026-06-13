import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Filter,
  MessageCircle,
  Phone,
  Plus,
  Target,
  Trash2,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useProduk } from '../lib/ProdukContext.jsx'
import { STATUS_PROSPEK, isStatusSelesai, labelStatus, useProspek } from '../lib/prospek.js'
import Header from '../components/Header.jsx'
import Loading from '../components/Loading.jsx'
import DataFooter from '../components/DataFooter.jsx'

function nomorWhatsApp(hp) {
  const angka = (hp || '').replace(/[^0-9]/g, '')
  if (!angka) return ''
  if (angka.startsWith('0')) return `62${angka.slice(1)}`
  if (angka.startsWith('62')) return angka
  return angka
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-gray-700">{label}</span>
      {children}
    </label>
  )
}

function inputClass() {
  return 'w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/30'
}

function tanggalHariIni() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10)
}

function formatTanggal(teks) {
  if (!teks) return ''
  const [tahun, bulan, tanggal] = teks.slice(0, 10).split('-')
  if (!tahun || !bulan || !tanggal) return teks
  return `${tanggal}/${bulan}/${tahun}`
}

function tanggalLokal(teks) {
  if (!teks) return null
  const [tahun, bulan, tanggal] = teks.slice(0, 10).split('-').map(Number)
  if (!tahun || !bulan || !tanggal) return null
  return new Date(tahun, bulan - 1, tanggal)
}

function selisihHari(tanggal, pembanding = tanggalHariIni()) {
  const target = tanggalLokal(tanggal)
  const hariIni = tanggalLokal(pembanding)
  if (!target || !hariIni) return null
  return Math.round((target.getTime() - hariIni.getTime()) / 86400000)
}

function infoFollowUp(item) {
  if (isStatusSelesai(item.status)) {
    return {
      label: labelStatus(item.status),
      detail: 'Pipeline selesai',
      className: 'bg-emerald-50 text-emerald-700',
      icon: CheckCircle2,
    }
  }

  if (!item.tanggalFollowUp) {
    return {
      label: 'Belum dijadwalkan',
      detail: 'Tambahkan tanggal follow-up',
      className: 'bg-gray-100 text-gray-600',
      icon: Clock3,
    }
  }

  const diff = selisihHari(item.tanggalFollowUp)
  if (diff === null) {
    return {
      label: formatTanggal(item.tanggalFollowUp),
      detail: 'Tanggal follow-up',
      className: 'bg-gray-100 text-gray-600',
      icon: CalendarDays,
    }
  }

  if (diff < 0) {
    return {
      label: 'Overdue',
      detail: `${Math.abs(diff)} hari lewat`,
      className: 'bg-red-50 text-red-700',
      icon: AlertTriangle,
    }
  }

  if (diff === 0) {
    return {
      label: 'Hari ini',
      detail: 'Perlu follow-up',
      className: 'bg-amber-50 text-amber-700',
      icon: Clock3,
    }
  }

  if (diff <= 7) {
    return {
      label: 'Minggu ini',
      detail: `${diff} hari lagi`,
      className: 'bg-blue-50 text-blue-700',
      icon: CalendarDays,
    }
  }

  return {
    label: 'Terjadwal',
    detail: formatTanggal(item.tanggalFollowUp),
    className: 'bg-navy/5 text-navy',
    icon: CalendarDays,
  }
}

const STATUS_CLASS = {
  baru: 'bg-gray-100 text-gray-700',
  sudah_dihubungi: 'bg-sky-50 text-sky-700',
  follow_up: 'bg-amber-50 text-amber-700',
  berminat: 'bg-emerald-50 text-emerald-700',
  tidak_berminat: 'bg-red-50 text-red-700',
  closing: 'bg-navy text-white',
}

function statusClass(status) {
  return STATUS_CLASS[status] || STATUS_CLASS.baru
}

function RingkasanKartu({ icon: Icon, label, value, helper, tone = 'navy' }) {
  const toneClass =
    tone === 'red'
      ? 'bg-red-50 text-red-700'
      : tone === 'amber'
        ? 'bg-amber-50 text-amber-700'
        : tone === 'emerald'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-navy/5 text-navy'

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon size={18} />
        </span>
        <span className="text-2xl font-extrabold text-gray-950">{value}</span>
      </div>
      <p className="mt-3 text-xs font-bold text-gray-900">{label}</p>
      {helper && <p className="mt-1 text-[11px] leading-relaxed text-gray-400">{helper}</p>}
    </div>
  )
}

export default function Prospek() {
  const { produk, loading } = useProduk()
  const { prospek, tambahProspek, ubahStatus, hapusProspek } = useProspek()
  const [searchParams] = useSearchParams()
  const produkAwal = searchParams.get('produk') || ''
  const [form, setForm] = useState({
    nama: '',
    hp: '',
    kebutuhan: '',
    produkId: produkAwal,
    picWa: '',
    tanggalFollowUp: tanggalHariIni(),
    status: 'baru',
    catatan: '',
  })
  const [filter, setFilter] = useState({
    picWa: '',
    tanggal: '',
    status: '',
  })

  const produkById = useMemo(() => {
    const map = new Map()
    for (const p of produk) map.set(p.id, p)
    return map
  }, [produk])

  const daftarPic = useMemo(() => {
    const map = new Map()
    for (const p of produk) {
      if (!p.pic_wa) continue
      if (!map.has(p.pic_wa)) {
        map.set(p.pic_wa, {
          wa: p.pic_wa,
          nama: p.pic_nama,
          jabatan: p.pic_jabatan,
        })
      }
    }
    return [...map.values()]
  }, [produk])

  useEffect(() => {
    const p = produkById.get(form.produkId)
    if (p?.pic_wa && !form.picWa) {
      setForm((prev) => ({ ...prev, picWa: p.pic_wa }))
    }
  }, [form.produkId, form.picWa, produkById])

  const prospekTampil = useMemo(
    () =>
      prospek.filter((item) => {
        const p = produkById.get(item.produkId)
        const picWa = item.picWa || p?.pic_wa || ''
        const tanggal = item.tanggalFollowUp || item.dibuatPada?.slice(0, 10) || ''
        const cocokPic = !filter.picWa || picWa === filter.picWa
        const cocokTanggal = !filter.tanggal || tanggal === filter.tanggal
        const cocokStatus = !filter.status || item.status === filter.status
        return cocokPic && cocokTanggal && cocokStatus
      }),
    [filter.picWa, filter.status, filter.tanggal, produkById, prospek],
  )

  const dashboard = useMemo(() => {
    const statusCounts = STATUS_PROSPEK.map((s) => ({
      ...s,
      jumlah: prospek.filter((p) => p.status === s.value).length,
    }))

    const aktif = prospek.filter((item) => !isStatusSelesai(item.status))
    const overdue = aktif.filter((item) => selisihHari(item.tanggalFollowUp) < 0).length
    const hariIni = aktif.filter((item) => selisihHari(item.tanggalFollowUp) === 0).length
    const mingguIni = aktif.filter((item) => {
      const diff = selisihHari(item.tanggalFollowUp)
      return diff !== null && diff >= 0 && diff <= 7
    }).length
    const closing = prospek.filter((item) => item.status === 'closing').length

    const perPicMap = new Map()
    const perProdukMap = new Map()
    for (const item of prospek) {
      const p = produkById.get(item.produkId)
      const picWa = item.picWa || p?.pic_wa || ''
      const pic = daftarPic.find((x) => x.wa === picWa)
      const picKey = picWa || 'tanpa-pic'
      const picNama = pic?.nama || item.picNama || 'PIC belum ditentukan'
      const picData = perPicMap.get(picKey) || { key: picKey, nama: picNama, total: 0, overdue: 0 }
      picData.total += 1
      if (!isStatusSelesai(item.status) && selisihHari(item.tanggalFollowUp) < 0) picData.overdue += 1
      perPicMap.set(picKey, picData)

      const produkNama = p?.nama_produk || 'Produk belum ditentukan'
      const produkData = perProdukMap.get(produkNama) || { nama: produkNama, total: 0 }
      produkData.total += 1
      perProdukMap.set(produkNama, produkData)
    }

    const perPic = [...perPicMap.values()].sort((a, b) => b.total - a.total).slice(0, 4)
    const perProduk = [...perProdukMap.values()].sort((a, b) => b.total - a.total).slice(0, 4)

    return { statusCounts, aktif: aktif.length, overdue, hariIni, mingguIni, closing, perPic, perProduk }
  }, [daftarPic, produkById, prospek])

  const ubah = (patch) => setForm((f) => ({ ...f, ...patch }))

  const submit = (e) => {
    e.preventDefault()
    const p = produkById.get(form.produkId)
    const pic = daftarPic.find((x) => x.wa === form.picWa)
    tambahProspek({
      ...form,
      picWa: form.picWa || p?.pic_wa || '',
      picNama: pic?.nama || p?.pic_nama || '',
      picJabatan: pic?.jabatan || p?.pic_jabatan || '',
    })
    setForm({
      nama: '',
      hp: '',
      kebutuhan: '',
      produkId: produkAwal,
      picWa: '',
      tanggalFollowUp: tanggalHariIni(),
      status: 'baru',
      catatan: '',
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-appbg">
      <Header
        judul="Catatan Prospek"
        subjudul="Simpan calon nasabah dan tindak lanjut produk yang diminati"
        back
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[24rem_1fr] lg:items-start">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-20">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-navy">
                  <Plus size={18} />
                </span>
                <div>
                  <h1 className="text-base font-extrabold text-gray-900">Simpan prospek</h1>
                  <p className="text-xs text-gray-400">Data tersimpan lokal di browser ini.</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <Field label="Nama nasabah / usaha">
                  <input
                    value={form.nama}
                    onChange={(e) => ubah({ nama: e.target.value })}
                    placeholder="Contoh: Toko Berkah Sunter"
                    className={inputClass()}
                    required
                  />
                </Field>

                <Field label="Nomor HP">
                  <input
                    value={form.hp}
                    onChange={(e) => ubah({ hp: e.target.value })}
                    placeholder="08xx atau 628xx"
                    inputMode="tel"
                    className={inputClass()}
                  />
                </Field>

                <Field label="Produk yang diminati">
                  <select
                    value={form.produkId}
                    onChange={(e) => {
                      const p = produkById.get(e.target.value)
                      ubah({ produkId: e.target.value, picWa: p?.pic_wa || form.picWa })
                    }}
                    className={inputClass()}
                  >
                    <option value="">Belum ditentukan</option>
                    {produk.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama_produk}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Field label="PIC follow-up">
                    <select
                      value={form.picWa}
                      onChange={(e) => ubah({ picWa: e.target.value })}
                      className={inputClass()}
                    >
                      <option value="">Belum ditentukan</option>
                      {daftarPic.map((pic) => (
                        <option key={pic.wa} value={pic.wa}>
                          {pic.nama} - {pic.jabatan}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Tanggal follow-up">
                    <input
                      type="date"
                      value={form.tanggalFollowUp}
                      onChange={(e) => ubah({ tanggalFollowUp: e.target.value })}
                      className={inputClass()}
                    />
                  </Field>
                </div>

                <Field label="Kebutuhan singkat">
                  <textarea
                    value={form.kebutuhan}
                    onChange={(e) => ubah({ kebutuhan: e.target.value })}
                    placeholder="Contoh: butuh QRIS dan modal usaha"
                    rows={3}
                    className={inputClass()}
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => ubah({ status: e.target.value })}
                    className={inputClass()}
                  >
                    {STATUS_PROSPEK.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Catatan follow-up">
                  <textarea
                    value={form.catatan}
                    onChange={(e) => ubah({ catatan: e.target.value })}
                    placeholder="Contoh: follow up besok pagi, minta info syarat KUR"
                    rows={3}
                    className={inputClass()}
                  />
                </Field>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-navy-dark active:scale-[0.98]"
                >
                  <ClipboardList size={16} />
                  Simpan Prospek
                </button>
              </form>
            </section>

            <section className="min-w-0">
              <div className="mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <RingkasanKartu
                    icon={ClipboardList}
                    label="Total prospek"
                    value={prospek.length}
                    helper={`${dashboard.aktif} masih aktif`}
                  />
                  <RingkasanKartu
                    icon={Clock3}
                    label="Follow-up hari ini"
                    value={dashboard.hariIni}
                    helper={`${dashboard.mingguIni} masuk minggu ini`}
                    tone="amber"
                  />
                  <RingkasanKartu
                    icon={AlertTriangle}
                    label="Overdue"
                    value={dashboard.overdue}
                    helper="Prioritas untuk dikejar"
                    tone="red"
                  />
                  <RingkasanKartu
                    icon={CheckCircle2}
                    label="Closing"
                    value={dashboard.closing}
                    helper="Prospek berhasil"
                    tone="emerald"
                  />
                </div>

                <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr_1fr]">
                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy/5 text-navy">
                        <BarChart3 size={16} />
                      </span>
                      <div>
                        <h2 className="text-sm font-extrabold text-gray-900">Pipeline status</h2>
                        <p className="text-xs text-gray-400">Sebaran tahapan prospek</p>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {dashboard.statusCounts.map((s) => (
                        <div key={s.value} className={`rounded-xl px-3 py-2 ${statusClass(s.value)}`}>
                          <p className="text-lg font-extrabold leading-none">{s.jumlah}</p>
                          <p className="mt-1 text-[11px] font-bold">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy/5 text-navy">
                        <UsersRound size={16} />
                      </span>
                      <div>
                        <h2 className="text-sm font-extrabold text-gray-900">Per PIC</h2>
                        <p className="text-xs text-gray-400">Beban follow-up</p>
                      </div>
                    </div>
                    {dashboard.perPic.length === 0 ? (
                      <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-400">Belum ada data PIC.</p>
                    ) : (
                      <div className="space-y-2">
                        {dashboard.perPic.map((pic) => (
                          <div key={pic.key} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
                            <span className="min-w-0 truncate text-xs font-bold text-gray-700">{pic.nama}</span>
                            <span className="shrink-0 text-xs font-extrabold text-navy">
                              {pic.total}
                              {pic.overdue > 0 && (
                                <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700">
                                  {pic.overdue} overdue
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy/5 text-navy">
                        <Target size={16} />
                      </span>
                      <div>
                        <h2 className="text-sm font-extrabold text-gray-900">Produk teratas</h2>
                        <p className="text-xs text-gray-400">Paling sering diprospek</p>
                      </div>
                    </div>
                    {dashboard.perProduk.length === 0 ? (
                      <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-400">Belum ada produk.</p>
                    ) : (
                      <div className="space-y-2">
                        {dashboard.perProduk.map((item) => (
                          <div key={item.nama} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
                            <span className="min-w-0 truncate text-xs font-bold text-gray-700">{item.nama}</span>
                            <span className="shrink-0 rounded-full bg-navy/5 px-2 py-1 text-xs font-extrabold text-navy">
                              {item.total}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy/5 text-navy">
                    <Filter size={16} />
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900">Filter prospek</h2>
                    <p className="text-xs text-gray-400">
                      {prospekTampil.length} dari {prospek.length} prospek ditampilkan
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_13rem_13rem_auto] xl:items-end">
                  <Field label="PIC">
                    <select
                      value={filter.picWa}
                      onChange={(e) => setFilter((f) => ({ ...f, picWa: e.target.value }))}
                      className={inputClass()}
                    >
                      <option value="">Semua PIC</option>
                      {daftarPic.map((pic) => (
                        <option key={pic.wa} value={pic.wa}>
                          {pic.nama} - {pic.jabatan}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Tanggal follow-up">
                    <input
                      type="date"
                      value={filter.tanggal}
                      onChange={(e) => setFilter((f) => ({ ...f, tanggal: e.target.value }))}
                      className={inputClass()}
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={filter.status}
                      onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
                      className={inputClass()}
                    >
                      <option value="">Semua status</option>
                      {STATUS_PROSPEK.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <button
                    onClick={() => setFilter({ picWa: '', tanggal: '', status: '' })}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-600 transition hover:border-gold hover:text-navy"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {prospek.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-400">
                  <UserRound size={34} className="text-gray-200" />
                  <p className="text-sm">Belum ada prospek tersimpan.</p>
                </div>
              ) : prospekTampil.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-400">
                  <CalendarDays size={34} className="text-gray-200" />
                  <p className="text-sm">Tidak ada prospek yang cocok dengan filter.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {prospekTampil.map((item) => {
                    const p = produkById.get(item.produkId)
                    const wa = nomorWhatsApp(item.hp)
                    const picWa = item.picWa || p?.pic_wa || ''
                    const pic = daftarPic.find((x) => x.wa === picWa)
                    const tanggalFollowUp = item.tanggalFollowUp || item.dibuatPada?.slice(0, 10)
                    const followUp = infoFollowUp({ ...item, tanggalFollowUp })
                    const FollowIcon = followUp.icon
                    return (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-base font-extrabold text-gray-900">
                                {item.nama}
                              </h2>
                              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass(item.status)}`}>
                                {labelStatus(item.status)}
                              </span>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${followUp.className}`}>
                                <FollowIcon size={11} />
                                {followUp.label}
                              </span>
                            </div>
                            {p ? (
                              <Link
                                to={`/produk/${p.id}`}
                                className="mt-1 inline-flex text-xs font-semibold text-amber-700 hover:underline"
                              >
                                {p.nama_produk}
                              </Link>
                            ) : (
                              <p className="mt-1 text-xs text-gray-400">Produk belum ditentukan</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-500">
                              <span className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2.5 py-1 text-navy">
                                <UserRound size={12} />
                                {pic?.nama || item.picNama || 'PIC belum ditentukan'}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                                <CalendarDays size={12} />
                                {tanggalFollowUp ? formatTanggal(tanggalFollowUp) : 'Tanggal belum ditentukan'}
                              </span>
                            </div>
                            <p className="mt-2 text-[11px] font-semibold text-gray-400">
                              {followUp.detail}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-wrap gap-2">
                            {wa && (
                              <a
                                href={`https://wa.me/${wa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-bold text-white"
                              >
                                <MessageCircle size={14} />
                                WA
                              </a>
                            )}
                            {item.hp && (
                              <a
                                href={`tel:${item.hp}`}
                                className="flex items-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-xs font-bold text-white"
                              >
                                <Phone size={14} />
                                Telepon
                              </a>
                            )}
                            <button
                              onClick={() => hapusProspek(item.id)}
                              aria-label="Hapus prospek"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-red-200 hover:text-red-500"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {(item.kebutuhan || item.catatan) && (
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {item.kebutuhan && (
                              <p className="rounded-xl bg-gray-50 p-3 text-sm leading-relaxed text-gray-600">
                                {item.kebutuhan}
                              </p>
                            )}
                            {item.catatan && (
                              <p className="rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-800">
                                {item.catatan}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                          <p className="text-[11px] text-gray-400">
                            Dibuat {formatTanggal(item.dibuatPada)}
                          </p>
                          <select
                            value={item.status}
                            onChange={(e) => ubahStatus(item.id, e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                          >
                            {STATUS_PROSPEK.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <DataFooter />
    </div>
  )
}
