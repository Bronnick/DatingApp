import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'

// Reuses the Angular client's localhost certs and port so the API's CORS policy
// (https://localhost:4200) works unchanged. Stop `ng serve` before running this.
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
