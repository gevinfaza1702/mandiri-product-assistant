import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { ambilProduk } from './produk.js'

// Context agar data produk di-fetch sekali dan dipakai bersama semua halaman.
const ProdukContext = createContext(null)

export function ProdukProvider({ children }) {
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [waktuFetch, setWaktuFetch] = useState(null) // kapan data terakhir diambil

  // muat: ambil ulang data dari sumber (spreadsheet atau fallback).
  const muat = useCallback(async () => {
    setLoading(true)
    const hasil = await ambilProduk()
    setProduk(hasil.produk)
    setOffline(hasil.offline)
    setWaktuFetch(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    muat()
  }, [muat])

  return (
    <ProdukContext.Provider value={{ produk, loading, offline, waktuFetch, refresh: muat }}>
      {children}
    </ProdukContext.Provider>
  )
}

// Hook praktis untuk konsumsi data produk.
export function useProduk() {
  const ctx = useContext(ProdukContext)
  if (!ctx) throw new Error('useProduk harus dipakai di dalam <ProdukProvider>')
  return ctx
}
