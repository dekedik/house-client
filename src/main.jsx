import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Убрали дублирующий fetch - используем только prefetch из HTML
// Это предотвращает дублирование запросов и уменьшает цепочку критических запросов

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



