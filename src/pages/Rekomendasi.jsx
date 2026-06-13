import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ChevronRight,
  Check,
  CheckCircle2,
  Star,
  Pencil,
  Headset,
  ClipboardList,
  ArrowRightLeft,
} from "lucide-react";
import { useProduk } from "../lib/ProdukContext.jsx";
import {
  KATEGORI_KEBUTUHAN,
  TUJUAN,
  DANA,
  LAMA_USAHA,
  PROFIL,
  hitungRekomendasi,
} from "../lib/rekomendasi.js";
import { KATEGORI } from "../config/config.js";
import Header from "../components/Header.jsx";
import Icon from "../components/Icon.jsx";
import Loading from "../components/Loading.jsx";
import DataFooter from "../components/DataFooter.jsx";

// ikon whatsapp
function WaIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.299zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

// Label langkah bernomor di panel form (kotak emas kecil + judul putih).
function LabelLangkah({ nomor, judul, opsional = false }) {
  return (
    <p className="mb-2 flex items-center gap-2 text-xs font-bold text-white">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gold text-[11px] font-extrabold text-navy-dark">
        {nomor}
      </span>
      {judul}
      {opsional && (
        <span className="font-normal text-white/50">(opsional)</span>
      )}
    </p>
  );
}

// Segmented control dua pilihan (dipakai untuk kategori & perkiraan dana).
function Segmen({ opsi, nilai, onPilih }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/10 p-1">
      {opsi.map((o) => {
        const aktif = nilai === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onPilih(o.value)}
            className={`rounded-lg px-2 py-2.5 text-xs font-bold leading-tight transition-all ${
              aktif
                ? "bg-white text-navy shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// Kartu hasil paling sesuai: bingkai gradient emas + badge.
function KartuTeratas({ produk: p, jawaban }) {
  const ikonKategori =
    KATEGORI.find((k) => k.nama === p.kategori)?.ikon || "LayoutGrid";
  const danaLabel = DANA.find((d) => d.value === jawaban.dana)?.label;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-gold via-amber-400 to-gold p-[2px] shadow-md">
      <div className="rounded-[14px] bg-white p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-navy-dark">
            <Star size={12} className="fill-navy-dark" />
            Paling Sesuai
          </span>
          <span className="hidden rounded-full bg-navy/5 px-2.5 py-1 text-[10px] font-semibold text-navy sm:block">
            {p.kategori}
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-white">
            <Icon name={ikonKategori} size={26} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-extrabold leading-tight text-gray-900">
              {p.nama_produk}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              {p.highlight || p.deskripsi_singkat}
            </p>
          </div>
        </div>

        {/* Alasan singkat: diambil dari jawaban form */}
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
          Sesuai untuk: {jawaban.tujuan}
          {danaLabel ? ` · ${danaLabel}` : ""}
        </p>

        {/* 3 keunggulan teratas */}
        {p.benefit.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {p.benefit.slice(0, 3).map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-gray-600 sm:text-sm"
              >
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={`/produk/${p.id}`}
            className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-dark"
          >
            Lihat Detail Produk
            <ChevronRight size={13} strokeWidth={2.5} />
          </Link>
          {p.pic_wa && (
            <a
              href={`https://wa.me/${p.pic_wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-105"
            >
              <WaIcon size={13} />
              Hubungi PIC
            </a>
          )}
          <Link
            to={`/prospek?produk=${p.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-navy transition hover:border-gold"
          >
            <ClipboardList size={13} />
            Simpan Prospek
          </Link>
          <Link
            to={`/compare?a=${p.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-navy transition hover:border-gold"
          >
            <ArrowRightLeft size={13} />
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}

// Kartu hasil alternatif: nomor peringkat di kiri.
function KartuAlternatif({ produk: p, peringkat }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-sm font-extrabold text-navy">
        {peringkat}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900">{p.nama_produk}</h3>
          <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[10px] font-semibold text-navy">
            {p.kategori}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {p.highlight || p.deskripsi_singkat}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-3">
          <Link
            to={`/produk/${p.id}`}
            className="flex items-center gap-1 text-xs font-bold text-navy hover:underline"
          >
            Lihat Detail
            <ChevronRight size={12} strokeWidth={2.5} />
          </Link>
          {p.pic_wa && (
            <a
              href={`https://wa.me/${p.pic_wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold text-[#1faf52] hover:underline"
            >
              <WaIcon size={12} />
              Hubungi PIC
            </a>
          )}
          <Link
            to={`/prospek?produk=${p.id}`}
            className="flex items-center gap-1 text-xs font-bold text-navy hover:underline"
          >
            <ClipboardList size={12} />
            Simpan Prospek
          </Link>
        </div>
      </div>
    </div>
  );
}

// Halaman rekomendasi: form panel navy (kiri) -> hasil berperingkat (kanan).
export default function Rekomendasi() {
  const { produk, loading } = useProduk();

  // Jawaban form. Mengganti kategori mengosongkan tujuan & lama usaha.
  const [jawaban, setJawaban] = useState({
    kategori: "",
    tujuan: "",
    dana: "",
    lamaUsaha: "",
    penghasilanTinggi: false,
    punyaLegalitas: false,
    punyaRekening: false,
    punyaKaryawan: false,
    payrollMandiri: false,
    perluTerimaBayar: false,
  });
  const [hasil, setHasil] = useState(null); // null = belum submit
  const [tampilForm, setTampilForm] = useState(false); // toggle form di mobile

  const valid = jawaban.kategori && jawaban.tujuan && jawaban.dana;
  const opsiTujuan = jawaban.kategori ? TUJUAN[jawaban.kategori] : [];
  const opsiProfil =
    jawaban.kategori === "pribadi"
      ? PROFIL.filter((o) =>
          ["penghasilanTinggi", "punyaRekening", "payrollMandiri"].includes(
            o.key,
          ),
        )
      : jawaban.kategori === "usaha"
        ? PROFIL.filter((o) =>
            [
              "punyaLegalitas",
              "punyaRekening",
              "punyaKaryawan",
              "perluTerimaBayar",
            ].includes(o.key),
          )
        : PROFIL.filter((o) => ["punyaRekening"].includes(o.key));
  const ubah = (patch) => setJawaban((j) => ({ ...j, ...patch }));

  const proses = () => {
    if (!valid) return;
    setHasil(hitungRekomendasi(produk, jawaban));
    setTampilForm(false);
  };

  const sudahSubmit = hasil !== null;
  const picKonsultasi = hasil?.[0] || produk[0];

  // ===== Panel form navy (kolom kiri) =====
  const formCard = (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-dark p-5 text-white shadow-md sm:p-6">
      {/* Dekorasi lingkaran samar */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-gold/10" />

      <div className="relative">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <Sparkles size={17} className="text-gold" />
          Cari Produk yang Pas
        </h2>
        <p className="mb-5 mt-1 text-xs leading-relaxed text-white/60">
          Jawab beberapa pertanyaan singkat, kami sarankan produk terbaik untuk
          calon nasabah Anda.
        </p>

        {/* 1. Kategori kebutuhan (segmented control) */}
        <div className="mb-4">
          <LabelLangkah nomor="1" judul="Kategori Kebutuhan" />
          <Segmen
            opsi={KATEGORI_KEBUTUHAN}
            nilai={jawaban.kategori}
            onPilih={(v) => ubah({ kategori: v, tujuan: "", lamaUsaha: "" })}
          />
        </div>

        {/* 2. Tujuan kebutuhan (chip, menyesuaikan kategori) */}
        <div className="mb-4">
          <LabelLangkah nomor="2" judul="Tujuan Kebutuhan" />
          {jawaban.kategori ? (
            <div className="flex flex-wrap gap-1.5">
              {opsiTujuan.map((t) => {
                const aktif = jawaban.tujuan === t;
                return (
                  <button
                    key={t}
                    onClick={() => ubah({ tujuan: t })}
                    className={`rounded-full border px-3 py-1.5 text-left text-[11px] font-semibold leading-tight transition-all ${
                      aktif
                        ? "border-gold bg-gold text-navy-dark"
                        : "border-white/25 bg-transparent text-white/80 hover:border-white/60"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-white/25 px-3 py-2.5 text-[11px] text-white/50">
              Pilih kategori kebutuhan dulu — pilihan tujuan akan menyesuaikan.
            </p>
          )}
        </div>

        {/* 3. Perkiraan dana */}
        <div className="mb-4">
          <LabelLangkah nomor="3" judul="Perkiraan Dana yang Dibutuhkan" />
          <Segmen
            opsi={DANA}
            nilai={jawaban.dana}
            onPilih={(v) => ubah({ dana: v })}
          />
        </div>

        {/* 4. Lama usaha (hanya untuk kategori usaha) */}
        {jawaban.kategori === "usaha" && (
          <div className="mb-4">
            <LabelLangkah nomor="4" judul="Lama Usaha Berjalan" opsional />
            <div className="flex flex-wrap gap-1.5">
              {LAMA_USAHA.map((o) => {
                const aktif = jawaban.lamaUsaha === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => ubah({ lamaUsaha: aktif ? "" : o.value })}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                      aktif
                        ? "border-gold bg-gold text-navy-dark"
                        : "border-white/25 text-white/80 hover:border-white/60"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Profil tambahan (saklar) */}
        <div className="mb-5">
          <LabelLangkah
            nomor={jawaban.kategori === "usaha" ? "5" : "4"}
            judul="Kondisi Tambahan"
            opsional
          />
          <div className="space-y-1.5">
            {opsiProfil.map((o) => {
              const aktif = jawaban[o.key];
              return (
                <button
                  key={o.key}
                  onClick={() => ubah({ [o.key]: !aktif })}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-left transition hover:bg-white/15"
                >
                  <span
                    className={`text-[11px] leading-snug ${
                      aktif ? "font-semibold text-white" : "text-white/70"
                    }`}
                  >
                    {o.label}
                  </span>
                  {/* Saklar kecil */}
                  <span
                    className={`relative flex h-[18px] w-8 shrink-0 items-center rounded-full transition-colors ${
                      aktif ? "bg-gold" : "bg-white/25"
                    }`}
                  >
                    <span
                      className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-all ${
                        aktif ? "left-[15px]" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={proses}
          disabled={!valid}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-extrabold text-navy-dark shadow-lg transition hover:brightness-105 active:scale-[0.98] disabled:bg-white/15 disabled:text-white/40"
        >
          <Sparkles size={16} />
          Tampilkan Rekomendasi
        </button>
      </div>
    </div>
  );

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
            <span className="font-semibold text-navy">Rekomendasi Produk</span>
          </nav>
          <h1 className="text-lg font-extrabold text-gray-900 sm:text-2xl">
            Rekomendasi Produk
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Isi informasi kebutuhan nasabah untuk mendapatkan produk yang paling
            sesuai
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Toggle form di mobile setelah submit */}
            {sudahSubmit && (
              <button
                onClick={() => setTampilForm((t) => !t)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-navy px-4 py-2.5 text-sm font-semibold text-navy lg:hidden"
              >
                <Pencil size={15} />
                {tampilForm ? "Sembunyikan Form" : "Ubah Informasi"}
              </button>
            )}

            <div className="flex flex-col items-start gap-4 sm:gap-6 lg:flex-row">
              {/* ===== Kolom kiri: panel form navy ===== */}
              <div
                className={`w-full lg:sticky lg:top-20 lg:w-[22rem] lg:shrink-0 ${
                  sudahSubmit && !tampilForm ? "hidden lg:block" : "block"
                }`}
              >
                {formCard}
              </div>

              {/* ===== Kolom kanan: hasil ===== */}
              <div className="w-full min-w-0 flex-1">
                {!sudahSubmit ? (
                  /* Keadaan awal: kartu putus-putus */
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy/15 bg-white/60 p-10 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy/5">
                      <Sparkles size={30} className="text-navy/60" />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-gray-800 sm:text-lg">
                      Rekomendasi akan tampil di sini
                    </h3>
                    <p className="max-w-xs text-xs text-gray-400 sm:text-sm">
                      Lengkapi pertanyaan di samping, lalu tekan "Tampilkan
                      Rekomendasi" — produk paling sesuai langsung muncul
                      beserta kontak PIC-nya.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Header hasil + tombol ubah (desktop) */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">
                          Hasil Rekomendasi
                        </h2>
                        <p className="text-xs text-gray-400 sm:text-sm">
                          {hasil.length > 0
                            ? `${hasil.length} produk paling sesuai berdasarkan jawaban Anda.`
                            : "Tidak ada produk yang cocok untuk kombinasi ini."}
                        </p>
                      </div>
                      <button
                        onClick={() => setHasil(null)}
                        className="hidden shrink-0 items-center gap-1.5 rounded-xl border-2 border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-navy hover:text-navy lg:flex"
                      >
                        <Pencil size={13} />
                        Ubah Informasi
                      </button>
                    </div>

                    {hasil.length === 0 ? (
                      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                        <p className="text-sm text-gray-500">
                          Coba ubah kombinasi jawaban, atau telusuri kategori
                          dari beranda.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {/* Hasil teratas: bingkai emas */}
                        <KartuTeratas produk={hasil[0]} jawaban={jawaban} />

                        {/* Alternatif berperingkat */}
                        {hasil.slice(1).map((p, i) => (
                          <KartuAlternatif
                            key={p.id}
                            produk={p}
                            peringkat={i + 2}
                          />
                        ))}
                      </div>
                    )}

                    {/* Panel konsultasi PIC (terang, beda dari referensi) */}
                    {picKonsultasi && (
                      <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                            <Headset size={20} className="text-navy" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              Masih ragu menentukan produk?
                            </p>
                            <p className="text-xs text-gray-500">
                              Konsultasikan kebutuhan nasabah dengan PIC Sales
                              kami.
                            </p>
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/${picKonsultasi.pic_wa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-navy-dark sm:w-auto sm:text-sm"
                        >
                          <Check size={14} strokeWidth={3} />
                          Konsultasi Sekarang
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <DataFooter />
    </div>
  );
}
