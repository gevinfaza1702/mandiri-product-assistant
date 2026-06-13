import { useState, useEffect, useCallback } from 'react'

// Simpan daftar id produk favorit di localStorage (preferensi kecil saja).
const KEY = 'pa_favorit'

function baca() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

// Hook favorit: kembalikan daftar id + fungsi toggle + pengecek.
export function useFavorit() {
  const [ids, setIds] = useState(baca)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const isFavorit = useCallback((id) => ids.includes(id), [ids])

  return { favoritIds: ids, toggle, isFavorit }
}
