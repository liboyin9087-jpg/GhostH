import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 路徑別名設定（對應 tsconfig.json）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // 開發伺服器設定
  server: {
    port: 3000,
    host: true, // 允許外部訪問
    open: true, // 自動開啟瀏覽器
  },

  // 建置設定
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    // Rollup 設定
    rollupOptions: {
      output: {
        // 程式碼分割策略
        manualChunks: {
          // 將 React 相關庫分離
          'vendor-react': ['react', 'react-dom'],
          // 將 AI 相關庫分離
          'vendor-ai': ['@google/generative-ai'],
          // 將音效相關庫分離
          'vendor-audio': ['use-sound'],
          // 將 UI 圖示庫分離
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    
    // 優化選項
    chunkSizeWarningLimit: 1000, // 將警告閾值提高到 1000kB
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生產環境移除 console
        drop_debugger: true,
      },
    },
  },

  // 預覽伺服器設定
  preview: {
    port: 4173,
    host: true,
  },

  // CSS 設定
  css: {
    devSourcemap: true,
  },
})
