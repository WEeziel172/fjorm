import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ['react', 'react-dom', '@hello-pangea/dnd'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
