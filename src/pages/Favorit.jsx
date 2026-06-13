import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useProduk } from '../lib/ProdukContext.jsx'
import { useFavorit } from '../lib/favorit.js'
import Header from '../components/Header.jsx'
import ProdukCard from '../components/ProdukCard.jsx'
import Loading from '../components/Loading.jsx'
import DataFooter from '../components/DataFooter.jsx'

// Halaman produk favorit (disimpan di localStorage) untuk akses cepat.
export default function Favorit() {
  const { produk, loading } = useProduk()
  const { favoritIds, isFavorit, toggle } = useFavorit()

  const daftar = useMemo(
    () => produk.filter((p) => favoritIds.includes(p.id)),
    [produk, favoritIds],
  )

  return (
    <div className="flex min-h-screen flex-col bg-appbg">
      <Header judul="Produk Favorit" subjudul={`${daftar.length} produk tersimpan`} back />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {loading ? (
          <Loading />
        ) : daftar.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-400">
            <Star size={32} className="text-gray-200" />
            <p className="text-sm">Belum ada produk favorit.</p>
            <Link to="/" className="text-xs font-semibold text-navy underline">
              Telusuri produk
            </Link>
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
