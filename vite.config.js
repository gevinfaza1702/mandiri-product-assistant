import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { jawabAsisten } from './api/_core.js'

// Konfigurasi Vite untuk React. Output build berupa static site (folder dist).
// Port mengikuti env PORT bila diset (dipakai preview tool); default 5173.
//
// Plugin "api-chat-dev": meniru endpoint /api/chat (Vercel serverless function)
// saat `npm run dev`, supaya Asisten Produk bisa diuji lokal tanpa deploy.
// API key dibaca dari file .env.local (SUMOPOD_API_KEY) — jangan di-commit.
function apiChatDev(env) {
  return {
    name: 'api-chat-dev',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Gunakan metode POST.' }))
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', async () => {
          try {
            const { messages, katalog, prospek } = JSON.parse(body || '{}')
            const hasil = await jawabAsisten({
              messages,
              katalog,
              prospek,
              apiKey: env.SUMOPOD_API_KEY,
            })
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = hasil.error ? 502 : 200
            res.end(JSON.stringify(hasil))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: `Terjadi kesalahan server: ${err.message}` }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Muat .env/.env.local (prefix kosong agar SUMOPOD_API_KEY ikut terbaca).
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), apiChatDev(env)],
    server: {
      port: Number(process.env.PORT) || 5173,
    },
  }
})
