import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/guild-battle-pass-visualizer/',
  build: {
    outDir: 'dist',
  },
})
