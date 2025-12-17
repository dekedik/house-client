import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Начинаем предзагрузку данных API для главной страницы сразу после загрузки основного JS
// Это позволяет начать загрузку параллельно с загрузкой HomePage компонента
if (window.location.pathname === '/') {
  // Предзагружаем данные API с низким приоритетом
  fetch('https://admin-doman-horizont.ru/api/v1/projects?limit=5', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => {
    // Игнорируем ошибки предзагрузки
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



