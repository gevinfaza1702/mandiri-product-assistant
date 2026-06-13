import { jawabAsisten } from './_core.js'

// ============================================================
//  SERVERLESS FUNCTION (Vercel) — endpoint POST /api/chat
//  API key dibaca dari environment variable SUMOPOD_API_KEY
//  (diset di dashboard Vercel: Settings > Environment Variables).
// ============================================================
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Gunakan metode POST.' })
    return
  }

  try {
    const { messages, katalog, prospek } = req.body || {}
    const hasil = await jawabAsisten({
      messages,
      katalog,
      prospek,
      apiKey: process.env.SUMOPOD_API_KEY,
    })

    if (hasil.error) {
      res.status(502).json({ error: hasil.error })
      return
    }
    res.status(200).json({ jawaban: hasil.jawaban })
  } catch (err) {
    res.status(500).json({ error: `Terjadi kesalahan server: ${err.message}` })
  }
}
