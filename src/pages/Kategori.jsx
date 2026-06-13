import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PackageOpen, ChevronRight } from 'lucide-react'
import { useProduk } from '../lib/ProdukContext.jsx'
import { useFavorit } from '../lib/favorit.js'
import Header from '../components/Header.jsx'
import ProdukCard from '../components/ProdukCard.jsx'
import Loading from '../components/Loading.jsx'
import DataFooter from '../components/DataFooter.jsx'

// Daftar produk untuk satu kategori (dari parameter URL).
export default function Kategori() {
  const { nama } = useParams()
  const kategori = decodeURIComponent(nama || '')
  const { produk, loading } = useProduk()
  const { isFavorit, toggle } = useFavorit()

  const daftar = useMemo(
    () => produk.filter((p) => p.kategori === kategori),
    [produk, kategori],
  )

  return (
    <div className="flex min-h-screen flex-col bg-appbg">
      <Header judul={kategori} subjudul={`${daftar.length} produk tersedia`} back />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Breadcrumb: Beranda > Kategori */}
        <nav className="mb-5 flex items-center gap-1.5 text-sm text-gray-400">
          <Link to="/" className="transition-colors hover:text-navy">
            Beranda
          </Link>
          <ChevronRight size={14} />
          <span className="truncate font-medium text-gray-700">{kategori}</span>
        </nav>

        {loading ? (
          <Loading />
        ) : daftar.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-400">
            <PackageOpen size={32} />
            <p className="text-sm">Belum ada produk di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {daftar.map((p, i) => (
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
      </main>

      <DataFooter />
    </div>
  )
}
