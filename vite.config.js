import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      // 只监听 src 目录，避免监听 .edge_profile 等浏览器配置目录导致 EBUSY 错误
      ignored: ['**/.edge_profile/**', '**/node_modules/**', '**/.git/**']
    }
  }
})
