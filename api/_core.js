// ============================================================
//  LOGIKA INTI ASISTEN PRODUK (dipakai oleh api/chat.js di Vercel
//  dan middleware dev server di vite.config.js)
//
//  Prinsip keamanan:
//  - API key HANYA hidup di server (env var), tidak pernah dikirim ke browser.
//  - Jawaban di-ground ke data katalog yang dikirim frontend — bukan data nasabah.
// ============================================================

const BASE_URL = process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com/v1'
const MODEL = process.env.SUMOPOD_MODEL || 'deepseek-v4-pro'

// Pagar pengaman: asisten hanya boleh menjawab seputar produk di katalog.
const SYSTEM_PROMPT = `Kamu adalah "Asisten Produk", asisten internal untuk pegawai Bank Mandiri KCP Sunter Permai.

Tugasmu: membantu pegawai menjelaskan dan memilihkan produk untuk calon nasabah, HANYA berdasarkan DATA KATALOG yang diberikan di bawah.

Selain katalog, kamu juga diberi CATATAN PROSPEK INTERNAL (daftar calon nasabah yang sedang di-follow-up pegawai). Kamu boleh menjawab pertanyaan tentang catatan ini, mis. "PIC Rani pegang berapa prospek?", "siapa yang harus di-follow-up hari ini?", atau merangkum status prospek.

Aturan ketat:
1. Jawab HANYA berdasarkan data katalog dan catatan prospek yang diberikan. Jangan mengarang angka bunga, biaya, syarat, fitur, atau data prospek yang tidak ada.
2. Jika informasi tidak ada di data, katakan jujur bahwa datanya tidak tersedia dan sarankan menghubungi PIC produk tersebut.
3. Tolak dengan sopan pertanyaan di luar topik produk perbankan & catatan prospek ini (politik, kode, pribadi, dll).
4. Nomor HP nasabah sengaja TIDAK diberikan kepadamu demi privasi — jika ditanya kontak nasabah, arahkan pegawai membukanya di halaman Catatan Prospek aplikasi. JANGAN meminta data pribadi sensitif (NIK, nomor rekening, dll).
5. Jawab dalam bahasa Indonesia yang ringkas dan mudah dipahami — pegawai sedang berdiri di depan calon nasabah. Gunakan poin-poin bila membantu. Maksimal ±150 kata.
6. Bila relevan, akhiri dengan menyebut nama PIC produk yang bisa dihubungi.
7. Akhiri jawaban yang memuat angka (bunga/biaya/limit) dengan catatan singkat: "Verifikasi detail terbaru ke PIC."`

// Panggil SumoPod (LiteLLM, OpenAI-compatible) dan kembalikan teks jawaban.
export async function jawabAsisten({ messages, katalog, prospek, apiKey }) {
  if (!apiKey) {
    return { error: 'API key belum dikonfigurasi di server.' }
  }

  // Batasi riwayat percakapan agar hemat token (8 pesan terakhir).
  const riwayat = (Array.isArray(messages) ? messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  if (riwayat.length === 0) {
    return { error: 'Pesan kosong.' }
  }

  const body = {
    model: MODEL,
    max_tokens: 700,
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content:
          `${SYSTEM_PROMPT}\n\n=== DATA KATALOG PRODUK ===\n${String(katalog || '').slice(0, 24000)}` +
          `\n\n=== CATATAN PROSPEK INTERNAL ===\n${String(prospek || 'Belum ada catatan prospek.').slice(0, 8000)}`,
      },
      ...riwayat,
    ],
  }

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const teks = await res.text().catch(() => '')
    return { error: `Layanan AI bermasalah (HTTP ${res.status}). ${teks.slice(0, 200)}` }
  }

  const data = await res.json()
  const jawaban = data?.choices?.[0]?.message?.content
  if (!jawaban) return { error: 'Jawaban kosong dari layanan AI.' }

  return { jawaban }
}
