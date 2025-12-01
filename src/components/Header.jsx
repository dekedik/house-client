import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CallbackModal from './CallbackModal'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false)
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Н</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Новостройки</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Дома
            </Link>
            <button 
              onClick={() => setIsAboutModalOpen(true)}
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              О компании
            </button>
            <button 
              onClick={() => setIsContactsModalOpen(true)}
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              Контакты
            </button>
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
            <button 
              onClick={() => {
                setIsAboutModalOpen(true)
                setIsMenuOpen(false)
              }}
              className="block py-2 text-gray-700 hover:text-primary-600 text-left w-full"
            >
              О компании
            </button>
            <button 
              onClick={() => {
                setIsContactsModalOpen(true)
                setIsMenuOpen(false)
              }}
              className="block py-2 text-gray-700 hover:text-primary-600 text-left w-full"
            >
              Контакты
            </button>
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

      {/* Contacts Modal */}
      {isContactsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Контакты</h2>
                <button
                  onClick={() => setIsContactsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Телефон</h3>
                  <div className="space-y-2">
                    <a href="tel:+79185429777" className="block text-primary-600 hover:text-primary-700 transition">
                      +7 (918) 542-97-77
                    </a>
                    <a href="tel:+79508503306" className="block text-primary-600 hover:text-primary-700 transition">
                      +7 (950) 850-33-06
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Адрес</h3>
                  <p className="text-gray-600">
                    г. Ростов-на-Дону<br />
                    ул. Михаила Нагибина, д.38
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Company Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">О компании</h2>
                <button
                  onClick={() => setIsAboutModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Агентство недвижимости «Горизонт» — надёжный партнёр в сфере новостроек, работающий на рынке более 5 лет. За это время мы помогли тысячам клиентов обрести идеальное жильё и заслужили репутацию профессиональной, прозрачной и клиентоориентированной компании.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Наша миссия</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Мы делаем покупку новостройки простой, безопасной и выгодной, так как работаем без комиссий. Наша цель — сопровождать клиента на каждом этапе сделки, предоставляя экспертную поддержку и персонализированные решения.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

