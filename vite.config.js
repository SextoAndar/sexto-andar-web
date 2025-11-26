import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://sexto-andar-dev-proxy-d6d.herokuapp.com',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://sexto-andar-dev-proxy-d6d.herokuapp.com',
        changeOrigin: true,
      },
    },
  },
})
