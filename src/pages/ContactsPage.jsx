import React from 'react'
import { Link } from 'react-router-dom'

const ContactsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <nav className="flex items-center space-x-2 text-base md:text-lg">
            <Link to="/" className="text-gray-500 hover:text-primary-600">
              Главная
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800">Контакты</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Контакты</h1>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Свяжитесь с нами</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Телефон</h3>
                <div className="space-y-3">
                  <a 
                    href="tel:+79185429777" 
                    className="block text-primary-600 hover:text-primary-700 transition text-lg font-medium"
                  >
                    +7 (918) 542-97-77
                  </a>
                  <a 
                    href="tel:+79508503306" 
                    className="block text-primary-600 hover:text-primary-700 transition text-lg font-medium"
                  >
                    +7 (950) 850-33-06
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Адрес</h3>
                <p className="text-gray-600 text-lg">
                  г. Ростов-на-Дону<br />
                  ул. Михаила Нагибина, д.38
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Режим работы</h2>
            <div className="space-y-2 text-gray-600">
              <p className="text-lg"><span className="font-semibold">Понедельник - Пятница:</span> 9:00 - 19:00</p>
              <p className="text-lg"><span className="font-semibold">Суббота:</span> 10:00 - 17:00</p>
              <p className="text-lg"><span className="font-semibold">Воскресенье:</span> Выходной</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactsPage

