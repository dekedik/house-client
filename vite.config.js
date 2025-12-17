import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  define: {
    'import.meta.env.API_URL': JSON.stringify(process.env.API_URL || process.env.VITE_API_URL || ''),
  },
  build: {
    // Оптимизация сборки
    rollupOptions: {
      output: {
        // Оптимизация имен файлов для лучшего кеширования
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Минификация
    minify: 'esbuild',
    // Включаем CSS code splitting для параллельной загрузки
    cssCodeSplit: true,
    // Оптимизация размера чанков
    chunkSizeWarningLimit: 600,
    // Отключаем source maps для production чтобы избежать проблем
    sourcemap: false,
    // Оптимизация CSS
    cssMinify: true,
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})

