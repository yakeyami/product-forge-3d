import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署在子路径，须与仓库名一致
  base: '/product-forge-3d/',
  plugins: [react(), tailwindcss()],
})
