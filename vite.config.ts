import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fixed dev port 5187 per project brief (5185 Sam'al, 5186 Göbekli Tepe).
// Static-host friendly (relative base).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5187,
    strictPort: true,
  },
  preview: {
    port: 5187,
    strictPort: true,
  },
})
