import { useCallback, useEffect, useState } from 'react'

const KEY = 'pa_prospek'

export const STATUS_PROSPEK = [
  { value: 'baru', label: 'Baru' },
  { value: 'sudah_dihubungi', label: 'Sudah Dihubungi' },
  { value: 'follow_up', label: 'Follow up' },
  { value: 'berminat', label: 'Berminat' },
  { value: 'tidak_berminat', label: 'Tidak Berminat' },
  { value: 'closing', label: 'Closing' },
]

const STATUS_LAMA = {
  tertarik: 'berminat',
  tidak_jadi: 'tidak_berminat',
}

function normalisasiStatus(status) {
  const value = STATUS_LAMA[status] || status || 'baru'
  return STATUS_PROSPEK.some((s) => s.value === value) ? value : 'baru'
}

function baca() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY)) || []
    return Array.isArray(data)
      ? data.map((item) => ({ ...item, status: normalisasiStatus(item.status) }))
      : []
  } catch {
    return []
  }
}

function buatId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function labelStatus(status) {
  return STATUS_PROSPEK.find((s) => s.value === normalisasiStatus(status))?.label || 'Baru'
}

export function isStatusSelesai(status) {
  return ['tidak_berminat', 'closing'].includes(normalisasiStatus(status))
}

export function useProspek() {
  const [prospek, setProspek] = useState(baca)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(prospek))
  }, [prospek])

  const tambahProspek = useCallback((data) => {
    const baru = {
      id: buatId(),
      nama: data.nama?.trim() || 'Tanpa nama',
      hp: data.hp?.trim() || '',
      kebutuhan: data.kebutuhan?.trim() || '',
      produkId: data.produkId || '',
      picWa: data.picWa || '',
      picNama: data.picNama || '',
      picJabatan: data.picJabatan || '',
      tanggalFollowUp: data.tanggalFollowUp || '',
      status: normalisasiStatus(data.status),
      catatan: data.catatan?.trim() || '',
      dibuatPada: new Date().toISOString(),
    }
    setProspek((prev) => [baru, ...prev])
    return baru
  }, [])

  const ubahStatus = useCallback((id, status) => {
    setProspek((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: normalisasiStatus(status), diubahPada: new Date().toISOString() } : p,
      ),
    )
  }, [])

  const hapusProspek = useCallback((id) => {
    setProspek((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { prospek, tambahProspek, ubahStatus, hapusProspek }
}
