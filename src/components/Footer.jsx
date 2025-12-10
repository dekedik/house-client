import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo.jpg" 
                alt="Горизонт" 
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold">Новостройки</span>
            </div>
            <p className="text-gray-400 text-sm">
              Агентство недвижимости по продаже квартир в новостройках
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Новостройки</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link 
                  to="/" 
                  state={{ filters: { district: '', housingClass: '', housingType: '', status: '', areaMin: '', areaMax: '', priceFromMin: '', priceFromMax: '' } }}
                  className="hover:text-white transition"
                >
                  Все проекты
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  state={{ filters: { district: '', housingClass: 'Премиум', housingType: '', status: '', areaMin: '', areaMax: '', priceFromMin: '', priceFromMax: '' } }}
                  className="hover:text-white transition"
                >
                  Премиум 
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  state={{ filters: { district: '', housingClass: 'Комфорт +', housingType: '', status: '', areaMin: '', areaMax: '', priceFromMin: '', priceFromMax: '' } }}
                  className="hover:text-white transition"
                >
                  Комфорт+
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  state={{ filters: { district: '', housingClass: 'Комфорт', housingType: '', status: '', areaMin: '', areaMax: '', priceFromMin: '', priceFromMax: '' } }}
                  className="hover:text-white transition"
                >
                  Комфорт
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  state={{ filters: { district: '', housingClass: 'Премиум', housingType: '', status: '', areaMin: '', areaMax: '', priceFromMin: '', priceFromMax: '' } }}
                  className="hover:text-white transition"
                >
                  Премиум
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition">О нас</Link></li>
              
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="tel:+79185429777" className="hover:text-white transition">
                  +7 (918) 542-97-77
                </a>
              </li>
              <li>
                <a href="tel:+79508503306" className="hover:text-white transition">
                  +7 (950) 850-33-06
                </a>
              </li>
              <li>г. Ростов-на-Дону</li>
              <li>ул. Михаила Нагибина, д.38</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 Агентство новостроек. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer



