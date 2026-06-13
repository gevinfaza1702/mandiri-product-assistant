import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ProdukProvider } from './lib/ProdukContext.jsx'
import Beranda from './pages/Beranda.jsx'
import Kategori from './pages/Kategori.jsx'
import Detail from './pages/Detail.jsx'
import Rekomendasi from './pages/Rekomendasi.jsx'
import Favorit from './pages/Favorit.jsx'
import Compare from './pages/Compare.jsx'
import Prospek from './pages/Prospek.jsx'
import Asisten from './pages/Asisten.jsx'

// Saat pindah halaman, scroll kembali ke atas (UX mobile yang wajar).
function ScrollKeAtas() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    // Provider membungkus semua rute agar data produk di-fetch sekali.
    <ProdukProvider>
      <ScrollKeAtas />
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/kategori/:nama" element={<Kategori />} />
        <Route path="/produk/:id" element={<Detail />} />
        <Route path="/rekomendasi" element={<Rekomendasi />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/prospek" element={<Prospek />} />
        <Route path="/asisten" element={<Asisten />} />
        <Route path="/favorit" element={<Favorit />} />
        {/* Rute tak dikenal -> kembali ke beranda */}
        <Route path="*" element={<Beranda />} />
      </Routes>
    </ProdukProvider>
  )
}
