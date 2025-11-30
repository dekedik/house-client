import React, { useState, useEffect, useMemo, useRef } from 'react'
import FilterPanel from '../components/FilterPanel'
import ProjectCard from '../components/ProjectCard'
import MortgageCalculator from '../components/MortgageCalculator'
import { api } from '../services/api'

const HomePage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    district: '',
    housingClass: '',
    housingType: '',
    status: '',
    areaMin: '',
    areaMax: '',
    priceFromMin: '',
    priceFromMax: '',
  })
  const [isMortgageCalculatorOpen, setIsMortgageCalculatorOpen] = useState(false)
  const filterSectionRef = useRef(null)

  // Загрузка проектов при монтировании и при изменении фильтров
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        
        // Преобразуем фильтры для API
        // API ожидает priceMin/priceMax, но в компоненте используются priceFromMin/priceFromMax
        const apiFilters = {
          district: filters.district || undefined,
          status: filters.status || undefined,
          type: filters.type || undefined,
          areaMin: filters.areaMin || undefined,
          areaMax: filters.areaMax || undefined,
          priceMin: filters.priceFromMin || undefined,
          priceMax: filters.priceFromMax || undefined,
        }
        
        // Удаляем undefined значения
        Object.keys(apiFilters).forEach(key => {
          if (apiFilters[key] === undefined || apiFilters[key] === '') {
            delete apiFilters[key]
          }
        })
        
        const data = await api.getProjects(apiFilters)
        setProjects(data)
        setError(null)
      } catch (err) {
        console.error('Ошибка при загрузке проектов:', err)
        setError(err.message || 'Не удалось загрузить проекты')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [filters])

  // Функция для определения класса жилья по цене
  const getHousingClass = (price) => {
    const priceNum = parseInt(price.replace(/\s/g, '').replace('₽', ''))
    if (priceNum >= 400000) return 'Премиум'
    if (priceNum >= 320000) return 'Комфорт +'
    if (priceNum >= 250000) return 'Комфорт'
    return 'Эконом'
  }

  // Функция для извлечения минимальной площади из строки "от 35 до 120 м²"
  const getMinArea = (areaStr) => {
    const match = areaStr.match(/от\s+(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  // Функция для извлечения максимальной площади из строки "от 35 до 120 м²"
  const getMaxArea = (areaStr) => {
    const match = areaStr.match(/до\s+(\d+)/)
    return match ? parseInt(match[1]) : Infinity
  }

  // Фильтрация на клиенте только для фильтров, которые не поддерживаются API
  // (housingClass и housingType - эти фильтры применяются на клиенте)
  // Остальные фильтры (district, status, areaMin, areaMax, priceFromMin, priceFromMax) 
  // уже применяются на сервере через API
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Фильтр по классу жилья (только клиентская фильтрация)
      if (filters.housingClass) {
        const projectClass = getHousingClass(project.price)
        if (projectClass !== filters.housingClass) return false
      }

      // Фильтр по типу жилья (только клиентская фильтрация)
      if (filters.housingType) {
        const projectRooms = project.rooms || ''
        // Проверяем соответствие типа жилья
        if (filters.housingType === 'Студия' && !projectRooms.includes('Студия')) return false
        if (filters.housingType === '1 спальня' && !projectRooms.includes('1')) return false
        if (filters.housingType === '2 спальни' && !projectRooms.includes('2')) return false
        if (filters.housingType === '3 спальни' && !projectRooms.includes('3')) return false
        if (filters.housingType === 'Более 4 спален' && !projectRooms.includes('4') && !projectRooms.includes('5')) return false
      }

      return true
    })
  }, [projects, filters.housingClass, filters.housingType])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop&q=80)'
          }}
        >
          {/* Overlay для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Квартиры в новостройках
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-primary-100">
              Более 1000 квартир в лучших жилых комплексах. Выгодные условия покупки и рассрочка до 20 лет.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  filterSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="bg-white text-primary-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Подобрать квартиру
              </button>
              <button 
                onClick={() => setIsMortgageCalculatorOpen(true)}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
              >
                Рассчитать ипотеку
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12" ref={filterSectionRef}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Каталог новостроек
            </h2>
            <p className="text-gray-600">
              Найдено проектов: {filteredProjects.length}
            </p>
          </div>

          <FilterPanel onFilterChange={setFilters} />

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Загрузка проектов...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">По заданным фильтрам ничего не найдено</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Безопасная сделка</h3>
              <p className="text-gray-600">Все документы проверены, сделки проходят через эскроу-счета</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Лучшие цены</h3>
              <p className="text-gray-600">Прямые договоры с застройщиками, без переплат и комиссий</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрое оформление</h3>
              <p className="text-gray-600">Помощь в оформлении ипотеки и всех документов за 1 день</p>
            </div>
          </div>
        </div>
      </section>

      <MortgageCalculator 
        isOpen={isMortgageCalculatorOpen} 
        onClose={() => setIsMortgageCalculatorOpen(false)} 
      />
    </div>
  )
}

export default HomePage

