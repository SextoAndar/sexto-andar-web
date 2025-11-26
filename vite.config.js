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
  define: {
    // Expose __DEBUG__ to the client-side code
    // It will be true if VITE_APP_DEBUG is 'true', otherwise false
    __DEBUG__: JSON.stringify(process.env.VITE_APP_DEBUG === 'true'),
  },
})
