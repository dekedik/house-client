import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = React.memo(() => {
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
            <span className="text-gray-800">О компании</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">О компании</h1>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Агентство недвижимости «Горизонт» — надёжный партнёр в сфере новостроек, работающий на рынке более 10 лет. За это время мы помогли тысячам клиентов обрести идеальное жильё и заслужили репутацию профессиональной, прозрачной и клиентоориентированной компании.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Наша миссия</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Мы делаем покупку новостройки простой, безопасной и выгодной, так как работаем без комиссий. Наша цель — сопровождать клиента на каждом этапе сделки, предоставляя экспертную поддержку и персонализированные решения.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Безопасная сделка</h3>
                  <p className="text-gray-600">Все документы проверены, сделки проходят через эскроу-счета</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Лучшие цены</h3>
                  <p className="text-gray-600">Прямые договоры с застройщиками, без переплат и комиссий</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Быстрое оформление</h3>
                  <p className="text-gray-600">Помощь в оформлении ипотеки и всех документов за 1 день</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Опытная команда</h3>
                  <p className="text-gray-600">Более 10 лет на рынке недвижимости, тысячи довольных клиентов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
})

AboutPage.displayName = 'AboutPage'

export default AboutPage

