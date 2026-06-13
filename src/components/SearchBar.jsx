import { Search, X } from 'lucide-react'

// Kotak pencarian global. Dikontrol dari luar (value + onChange).
export default function SearchBar({ value, onChange, placeholder = 'Cari produk…', autoFocus = false }) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40"
      />
      <input
        type="search"
        inputMode="search"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-navy/10 bg-white py-3 pl-11 pr-10 text-sm text-navy-dark shadow-card outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Hapus pencarian"
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-navy/5 text-navy/50 transition active:scale-90"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
