import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'

const sslDir = path.resolve(import.meta.dirname, '../client/ssl')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  server: {
    port: 4200,
    strictPort: true,
    https: {
      key: fs.readFileSync(path.join(sslDir, 'localhost-key.pem')),
      cert: fs.readFileSync(path.join(sslDir, 'localhost.pem')),
    },
  },
})
