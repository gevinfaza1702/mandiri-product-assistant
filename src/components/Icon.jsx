import {
  QrCode,
  PiggyBank,
  Store,
  Building2,
  Landmark,
  CreditCard,
  HandCoins,
  LayoutGrid,
  Square,
} from 'lucide-react'

// Peta ikon kategori. Impor eksplisit (bukan import *) supaya bundle tetap kecil —
// hanya ikon yang benar-benar dipakai yang ikut dibundel.
const PETA = { QrCode, PiggyBank, Store, Building2, Landmark, CreditCard, HandCoins, LayoutGrid }

// Render ikon lucide berdasarkan nama (string) dari config.
// Fallback ke ikon kotak bila nama tidak terdaftar.
export default function Icon({ name, ...props }) {
  const Cmp = PETA[name] || Square
  return <Cmp {...props} />
}
