import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CallbackModal from './CallbackModal'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.jpg" 
              alt="Горизонт" 
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-gray-800">Новостройки</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Дома
            </Link>
            <Link 
              to="/about"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              О компании
            </Link>
            <Link 
              to="/contacts"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              Контакты
            </Link>
            <button 
              onClick={() => setIsCallbackModalOpen(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Заказать звонок
            </button>
          </nav>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary-600">
              Дома
            </Link>
            <Link 
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-primary-600"
            >
              О компании
            </Link>
            <Link 
              to="/contacts"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-primary-600"
            >
              Контакты
            </Link>
            <button 
              onClick={() => {
                setIsCallbackModalOpen(true)
                setIsMenuOpen(false)
              }}
              className="mt-4 w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Заказать звонок
            </button>
          </div>
        )}
      </div>

      <CallbackModal 
        isOpen={isCallbackModalOpen} 
        onClose={() => setIsCallbackModalOpen(false)} 
      />
    </header>
  )
}

export default Header

