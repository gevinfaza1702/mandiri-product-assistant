import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// HashRouter dipakai supaya deep-link (mis. #/produk/qris-mandiri) tetap jalan
// di hosting statis (Vercel/Netlify) tanpa perlu konfigurasi rewrite server.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
