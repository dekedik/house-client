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
        manualChunks: (id) => {
          // Разделяем vendor код на отдельные чанки для параллельной загрузки
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            // Другие vendor библиотеки в отдельный чанк
            return 'vendor'
          }
        },
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
    // Уменьшаем размер выходных файлов
    target: 'esnext',
    modulePreload: {
      polyfill: false, // Отключаем polyfill для modulepreload
    },
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})

