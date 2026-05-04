import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  base: process.env.VITE_BASE || '/fjorm/demo/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/@dnd-kit')) return 'vendor-dnd'
        },
      },
    },
  },
})
