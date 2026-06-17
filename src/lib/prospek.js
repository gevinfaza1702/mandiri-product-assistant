import { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseSiap } from './supabase.js'

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

export function labelStatus(status) {
  return STATUS_PROSPEK.find((s) => s.value === normalisasiStatus(status))?.label || 'Baru'
}

export function isStatusSelesai(status) {
  return ['tidak_berminat', 'closing'].includes(normalisasiStatus(status))
}

// Ubah baris dari Supabase (snake_case) menjadi bentuk yang dipakai UI (camelCase).
function dariBaris(row) {
  return {
    id: row.id,
    nama: row.nama || '',
    hp: row.hp || '',
    kebutuhan: row.kebutuhan || '',
    produkId: row.produk_id || '',
    picWa: row.pic_wa || '',
    picNama: row.pic_nama || '',
    picJabatan: row.pic_jabatan || '',
    tanggalFollowUp: row.tanggal_follow_up || '',
    status: normalisasiStatus(row.status),
    catatan: row.catatan || '',
    nominal: row.nominal ?? '',
    dibuatPada: row.dibuat_pada || row.created_at || '',
    diubahPada: row.diubah_pada || '',
  }
}

// Ubah bentuk UI (camelCase) menjadi baris untuk Supabase (snake_case).
function keBaris(data) {
  const baris = {}
  if (data.nama !== undefined) baris.nama = data.nama?.trim() || 'Tanpa nama'
  if (data.hp !== undefined) baris.hp = data.hp?.trim() || ''
  if (data.kebutuhan !== undefined) baris.kebutuhan = data.kebutuhan?.trim() || ''
  if (data.produkId !== undefined) baris.produk_id = data.produkId || ''
  if (data.picWa !== undefined) baris.pic_wa = data.picWa || ''
  if (data.picNama !== undefined) baris.pic_nama = data.picNama || ''
  if (data.picJabatan !== undefined) baris.pic_jabatan = data.picJabatan || ''
  if (data.tanggalFollowUp !== undefined) baris.tanggal_follow_up = data.tanggalFollowUp || null
  if (data.status !== undefined) baris.status = normalisasiStatus(data.status)
  if (data.catatan !== undefined) baris.catatan = data.catatan?.trim() || ''
  if (data.nominal !== undefined) baris.nominal = data.nominal === '' ? null : Number(data.nominal)
  return baris
}

export function useProspek() {
  const [prospek, setProspek] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const muat = useCallback(async () => {
    if (!supabaseSiap) {
      setError('Supabase belum dikonfigurasi.')
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error: err } = await supabase
      .from('prospek')
      .select('*')
      .order('dibuat_pada', { ascending: false })
    if (err) {
      setError(err.message)
    } else {
      setError('')
      setProspek((data || []).map(dariBaris))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    muat()
  }, [muat])

  const tambahProspek = useCallback(
    async (data) => {
      if (!supabaseSiap) return null
      const baris = { ...keBaris(data), dibuat_pada: new Date().toISOString() }
      const { data: inserted, error: err } = await supabase
        .from('prospek')
        .insert(baris)
        .select()
        .single()
      if (err) {
        setError(err.message)
        return null
      }
      const baru = dariBaris(inserted)
      setProspek((prev) => [baru, ...prev])
      return baru
    },
    [],
  )

  const ubahStatus = useCallback(async (id, status) => {
    if (!supabaseSiap) return
    const patch = { status: normalisasiStatus(status), diubah_pada: new Date().toISOString() }
    setProspek((prev) => prev.map((p) => (p.id === id ? { ...p, status: patch.status } : p)))
    const { error: err } = await supabase.from('prospek').update(patch).eq('id', id)
    if (err) setError(err.message)
  }, [])

  const ubahProspek = useCallback(async (id, data) => {
    if (!supabaseSiap) return
    const patch = { ...keBaris(data), diubah_pada: new Date().toISOString() }
    const { data: updated, error: err } = await supabase
      .from('prospek')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (err) {
      setError(err.message)
      return
    }
    const baru = dariBaris(updated)
    setProspek((prev) => prev.map((p) => (p.id === id ? baru : p)))
  }, [])

  const hapusProspek = useCallback(async (id) => {
    if (!supabaseSiap) return
    const sebelum = prospek
    setProspek((prev) => prev.filter((p) => p.id !== id))
    const { error: err } = await supabase.from('prospek').delete().eq('id', id)
    if (err) {
      setError(err.message)
      setProspek(sebelum)
    }
  }, [prospek])

  return {
    prospek,
    loading,
    error,
    muat,
    tambahProspek,
    ubahStatus,
    ubahProspek,
    hapusProspek,
  }
}
