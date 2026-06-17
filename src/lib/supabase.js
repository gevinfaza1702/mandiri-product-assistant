// ============================================================
//  KLIEN SUPABASE
//  - URL & anon key dibaca dari env (VITE_ prefix = aman di browser).
//  - anon key memang dirancang untuk dipakai di sisi browser; keamanan
//    data dijaga lewat Row Level Security (RLS) di Supabase, bukan key.
//  - Jika env belum diisi, klien = null dan halaman Prospek menampilkan
//    pesan konfigurasi (app lain tetap jalan normal).
// ============================================================

import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseSiap = Boolean(URL && ANON_KEY)

export const supabase = supabaseSiap ? createClient(URL, ANON_KEY) : null
