import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 相对路径 base：兼容 GitHub Pages 子路径（https://<user>.github.io/<repo>/）与自定义域名
  base: './',
  build: {
    rollupOptions: {
      output: {
        // 纯 hash 命名，避免中文文件名导致 URL 编码 404
        assetFileNames: 'assets/[hash][extname]',
      },
    },
  },
  server: {
    port: 5173,
    watch: {
      // 只监听 src 目录，避免监听 .edge_profile 等浏览器配置目录导致 EBUSY 错误
      ignored: ['**/.edge_profile/**', '**/node_modules/**', '**/.git/**']
    }
  }
})
