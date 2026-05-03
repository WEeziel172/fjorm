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
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react'
          if (id.includes('node_modules/antd')) return 'vendor-antd'
          if (id.includes('node_modules/@mantine')) return 'vendor-mantine'
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) return 'vendor-mui'
        },
      },
    },
  },
})
