import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'

// Kartu produk gaya katalog: putih, lingkaran dekoratif, hover terangkat,
// label kategori kecil di atas + tautan "Lihat Produk" di bawah.
export default function ProdukCard({ produk, index = 0, isFavorit, onToggleFavorit }) {
  return (
    <Link
      to={`/produk/${produk.id}`}
      className="group relative flex animate-fade-up flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      {/* Lingkaran dekoratif pojok kanan atas */}
      <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-amber-50" />

      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-navy">
            {produk.kategori}
          </p>
          {onToggleFavorit && (
            <button
              onClick={(e) => {
                e.preventDefault() // jangan ikut navigasi link
                onToggleFavorit(produk.id)
              }}
              aria-label={isFavorit ? 'Hapus dari favorit' : 'Tandai favorit'}
              className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-50 active:scale-90"
            >
              <Star size={17} className={isFavorit ? 'fill-gold text-gold' : 'text-gray-300'} />
            </button>
          )}
        </div>
        <h3 className="mt-1.5 text-base font-bold leading-snug text-gray-900">
          {produk.nama_produk}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-gray-400">
          {produk.highlight || produk.deskripsi_singkat}
        </p>
      </div>

      <div className="relative mt-3 flex items-center gap-1 text-xs font-semibold text-navy transition-all group-hover:gap-2">
        Lihat Produk
        <ArrowRight size={14} />
      </div>
    </Link>
  )
}
