import { defineConfig } from 'vite'

export default defineConfig({
  // Intentionally non-root: verifies the GitHub Pages / PR-preview hosting model.
  base: process.env.VITE_BASE ?? '/ai-engineering-talk/pr-preview/pr-10/order-api/',
  build: { outDir: 'dist' },
  server: { host: '127.0.0.1', port: 4177, strictPort: true },
  preview: { host: '127.0.0.1', port: 4177, strictPort: true },
})
