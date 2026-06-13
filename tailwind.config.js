/** @type {import('tailwindcss').Config} */
// Konfigurasi Tailwind: warna & font identitas Bank Mandiri.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palet Mandiri (mengikuti gaya katalog referensi)
        navy: {
          DEFAULT: '#003F87',
          dark: '#002d63',
        },
        gold: '#F5A623',
        appbg: '#F5F6FA',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 4px 20px -8px rgba(10, 61, 126, 0.18)',
        'card-hover': '0 10px 30px -10px rgba(10, 61, 126, 0.28)',
      },
      maxWidth: {
        app: '480px', // lebar maksimal konten (mobile-first, terpusat di desktop)
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
