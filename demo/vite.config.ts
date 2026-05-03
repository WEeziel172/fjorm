import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@hello-pangea/dnd'],
  },
  base: process.env.VITE_BASE || '/fjorm/demo/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/@hello-pangea')) return 'vendor-dnd'
        },
      },
    },
  },
})
