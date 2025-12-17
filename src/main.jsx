import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Начинаем загрузку данных API для главной страницы сразу после загрузки основного JS
// Это позволяет начать загрузку параллельно с рендерингом компонентов
if (typeof window !== 'undefined' && window.location.pathname === '/') {
  // Используем requestIdleCallback для неблокирующей предзагрузки
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      fetch('https://admin-doman-horizont.ru/api/v1/projects?limit=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        // Игнорируем ошибки предзагрузки
      })
    }, { timeout: 2000 })
  } else {
    // Fallback для браузеров без requestIdleCallback
    setTimeout(() => {
      fetch('https://admin-doman-horizont.ru/api/v1/projects?limit=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        // Игнорируем ошибки предзагрузки
      })
    }, 100)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



