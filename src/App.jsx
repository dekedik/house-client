import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Убираем lazy loading для HomePage, так как это главная страница и LCP критичен
import HomePage from './pages/HomePage'
// Lazy loading только для ProjectDetailPage
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))

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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/project/:id" 
              element={
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                      <p className="mt-4 text-gray-600">Загрузка...</p>
                    </div>
                  </div>
                }>
                  <ProjectDetailPage />
                </Suspense>
              }
            />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App



