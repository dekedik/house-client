import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Lazy loading только для тяжелых страниц
const HomePage = lazy(() => import('./pages/HomePage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))

// Компонент для предзагрузки данных главной страницы
const DataPrefetcher = () => {
  const location = useLocation()
  
  useEffect(() => {
    // Если мы на главной странице, предзагружаем данные API сразу
    if (location.pathname === '/') {
      // Начинаем загрузку данных API параллельно с загрузкой HomePage компонента
      // Используем низкий приоритет, чтобы не блокировать критический путь
      const controller = new AbortController()
      
      // Предзагружаем данные API для главной страницы
      // Браузер может использовать кеш этого запроса когда HomePage сделает реальный запрос
      fetch('https://admin-doman-horizont.ru/api/v1/projects?limit=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        // Используем низкий приоритет для prefetch
        priority: 'low',
      }).catch(() => {
        // Игнорируем ошибки предзагрузки
      })
      
      return () => {
        controller.abort()
      }
    }
  }, [location.pathname])
  
  return null
}

// Легкие страницы загружаем сразу для быстрого рендера
import ContactsPage from './pages/ContactsPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <DataPrefetcher />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Загрузка...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/project/:id" element={<ProjectDetailPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App



