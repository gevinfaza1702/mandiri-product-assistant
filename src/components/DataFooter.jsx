import { RefreshCw, WifiOff, CheckCircle2 } from 'lucide-react'
import { useProduk } from '../lib/ProdukContext.jsx'
import { formatWaktu } from '../lib/util.js'

// Footer putih ala katalog: indikator sumber data + tombol refresh + copyright.
export default function DataFooter() {
  const { offline, waktuFetch, refresh, loading } = useProduk()

  return (
    <footer className="mt-4 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          {offline ? (
            <WifiOff size={13} className="shrink-0 text-amber-500" />
          ) : (
            <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
          )}
          <span>
            {offline ? 'Data offline (lokal)' : 'Data terbaru'} · Per: {formatWaktu(waktuFetch)}
          </span>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 font-semibold text-navy transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <p className="text-center text-xs text-gray-400">
          © 2026 ODP 328 · KCP Sunter Permai. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
