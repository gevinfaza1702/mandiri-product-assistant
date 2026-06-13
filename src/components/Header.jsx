import { ChevronLeft, Building2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

// Navbar sticky putih ala katalog Mandiri: logo kiri, identitas KCP kanan.
// Jika `judul` diisi, tampil blok judul halaman di bawah navbar.
export default function Header({ judul, subjudul, back = false, kanan = null }) {
  const navigate = useNavigate()

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            {back && (
              <button
                onClick={() => navigate(-1)}
                aria-label="Kembali"
                className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy transition hover:bg-gray-100 active:scale-90"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <Link to="/" className="flex shrink-0 items-center">
              <img
                src="/logo-mandiri.svg"
                alt="Bank Mandiri"
                width="110"
                height="30"
                className="h-auto w-[96px] object-contain mix-blend-multiply sm:w-[110px]"
              />
            </Link>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Building2 size={18} className="shrink-0 text-navy" strokeWidth={1.8} />
            <span className="hidden truncate text-xs font-medium text-gray-600 sm:block sm:text-sm">
              KCP Bank Mandiri Sunter Permai
            </span>
            <span className="block truncate text-xs font-medium text-gray-600 sm:hidden">
              Sunter Permai
            </span>
            {kanan}
          </div>
        </div>
      </nav>

      {judul && (
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
            <h1 className="text-lg font-bold leading-tight text-gray-900 sm:text-xl">{judul}</h1>
            {subjudul && <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{subjudul}</p>}
          </div>
        </div>
      )}
    </>
  )
}
