import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import FilterPanel from '../components/FilterPanel'
import ProjectCard from '../components/ProjectCard'
import ProjectCardSkeleton from '../components/ProjectCardSkeleton'
import ApartmentFinder from '../components/ApartmentFinder'
import MortgageCalculator from '../components/MortgageCalculator'
import { api } from '../services/api'

const HomePage = () => {
  const location = useLocation()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 5
  const [filters, setFilters] = useState({
    district: '',
    housingClass: '',
    housingType: '',
    status: '',
    areaMin: '',
    areaMax: '',
    priceFromMin: '',
    priceFromMax: '',
    paymentType: '',
    designType: '',
  })
  const [isMortgageCalculatorOpen, setIsMortgageCalculatorOpen] = useState(false)
  const [isApartmentFinderOpen, setIsApartmentFinderOpen] = useState(false)
  const filterSectionRef = useRef(null)
  const loadMoreRef = useRef(null)
  const prevFiltersRef = useRef(null)

  // Применяем фильтры из state при навигации (например, из Footer)
  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters)
      // Прокручиваем к секции с фильтрами с использованием requestAnimationFrame для избежания forced reflow
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          filterSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
    }
  }, [location.state])

  const loadProjects = useCallback(async (currentOffset = 0, append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setOffset(0)
        setHasMore(true)
      }
      
      // Используем кеш браузера если запрос уже был предзагружен
      const data = await api.getProjects({
        ...filters,
        limit: LIMIT,
        offset: currentOffset,
      })
      
      if (append) {
        setProjects(prev => [...prev, ...(data || [])])
        setOffset(currentOffset + LIMIT)
      } else {
        setProjects(data || [])
        setOffset(LIMIT)
        
        // Preload для LCP изображения первого проекта
        if (data && data.length > 0) {
          const firstProject = data[0]
          let firstImage = null
          
          if (firstProject.images) {
            if (Array.isArray(firstProject.images)) {
              firstImage = firstProject.images[0]
            } else if (typeof firstProject.images === 'string') {
              try {
                const parsed = JSON.parse(firstProject.images)
                firstImage = Array.isArray(parsed) ? parsed[0] : null
              } catch (e) {
                // Игнорируем ошибку парсинга
              }
            }
          }
          
          if (!firstImage && firstProject.image) {
            firstImage = firstProject.image
          }
          
          if (firstImage) {
            // Добавляем preload для первого изображения первого проекта
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = firstImage
            link.setAttribute('fetchpriority', 'high')
            document.head.appendChild(link)
          }
        }
      }
      
      // Проверяем, есть ли еще проекты для загрузки
      setHasMore((data || []).length === LIMIT)
      setError(null)
    } catch (err) {
      console.error('Ошибка при загрузке проектов:', err)
      setError(err.message || 'Не удалось загрузить проекты')
      if (!append) {
        setProjects([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters, LIMIT])

  // Загрузка проектов при изменении фильтров (включая первую загрузку)
  useEffect(() => {
    // Проверяем, изменились ли фильтры (кроме клиентских фильтров для пагинации)
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)
    if (filtersChanged || prevFiltersRef.current === null) {
      prevFiltersRef.current = filters
      loadProjects(0, false)
    }
  }, [filters, loadProjects])

  // Загрузка дополнительных проектов
  const loadMoreProjects = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      loadProjects(offset, true)
    }
  }, [loadingMore, hasMore, loading, offset, loadProjects])

  // Intersection Observer для infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreProjects()
        }
      },
      {
        rootMargin: '200px', // Начинаем загрузку за 200px до элемента
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [hasMore, loadingMore, loading, loadMoreProjects])

  // Фильтрация на клиенте только для тех фильтров, которые не обрабатываются на сервере
  // Серверные фильтры: district, status, housingClass, areaMin, areaMax, priceMin, priceMax
  // Клиентские фильтры: housingType (тип жилья), paymentType (вид оплаты), designType (вид отделки)
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Фильтр по типу жилья (только на клиенте)
      if (filters.housingType) {
        // Используем rooms_available (массив) или rooms (строка) для обратной совместимости
        let projectRooms = project.rooms_available || project.rooms
        
        // Если это строка, преобразуем в массив
        if (typeof projectRooms === 'string') {
          projectRooms = [projectRooms]
        }
        
        // Если массив пустой или нет данных, пропускаем проект
        if (!projectRooms || projectRooms.length === 0) return false
        
        // Проверяем соответствие типа жилья
        if (filters.housingType === 'Студия') {
          return projectRooms.some(room => room.toLowerCase().includes('студия'))
        }
        if (filters.housingType === '1 спальня') {
          return projectRooms.some(room => room.includes('1к') || room.includes('1 '))
        }
        if (filters.housingType === '2 спальни') {
          return projectRooms.some(room => room.includes('2к') || room.includes('2 '))
        }
        if (filters.housingType === '3 спальни') {
          return projectRooms.some(room => room.includes('3к') || room.includes('3 '))
        }
        if (filters.housingType === 'Более 4 спален') {
          return projectRooms.some(room => 
            room.includes('4к') || room.includes('4 ') || 
            room.includes('5к') || room.includes('5 ') ||
            room.includes('6к') || room.includes('6 ')
          )
        }
      }

      // Фильтр по виду оплаты
      if (filters.paymentType) {
        const projectPaymentTypes = project.payment_types
        if (!projectPaymentTypes || projectPaymentTypes.length === 0) return false
        if (!projectPaymentTypes.includes(filters.paymentType)) return false
      }

      // Фильтр по виду отделки
      if (filters.designType) {
        const projectDesignTypes = project.design_types
        if (!projectDesignTypes || projectDesignTypes.length === 0) return false
        if (!projectDesignTypes.includes(filters.designType)) return false
      }

      return true
    })
  }, [filters, projects])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop&q=75&auto=format)'
          }}
        >
          {/* Overlay для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Квартиры в новостройках
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-primary-100">
              Более 1000 квартир в лучших жилых комплексах. Выгодные условия покупки и рассрочка до 20 лет.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsApartmentFinderOpen(true)}
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
      <section className="container mx-auto px-4 py-12" ref={filterSectionRef}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Каталог новостроек
          </h2>
        </div>

        <FilterPanel onFilterChange={setFilters} initialFilters={filters} />

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            {error.includes('время ожидания') || error.includes('подключения') ? (
              <button
                onClick={() => loadProjects(0, false)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Попробовать снова
              </button>
            ) : null}
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <div className="space-y-4">
              {filteredProjects.map((project, index) => {
                const isLastTwo = index >= filteredProjects.length - 2
                const isFirstProject = index === 0
                return (
                  <React.Fragment key={project.id}>
                    {isLastTwo && index === filteredProjects.length - 2 && hasMore && (
                      <div ref={loadMoreRef} className="h-1" />
                    )}
                    <ProjectCard project={project} isFirstProject={isFirstProject} />
                  </React.Fragment>
                )
              })}
            </div>
            {/* Скелетон при загрузке дополнительных проектов */}
            {loadingMore && (
              <div className="space-y-4 mt-4">
                {[...Array(2)].map((_, index) => (
                  <ProjectCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            )}
            {/* Сообщение, если больше нет проектов */}
            {!hasMore && filteredProjects.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Все проекты загружены</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">По заданным фильтрам ничего не найдено</p>
          </div>
        )}
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

      <ApartmentFinder
        isOpen={isApartmentFinderOpen}
        onClose={() => setIsApartmentFinderOpen(false)}
        onApplyFilters={(filters) => {
          setFilters(filters)
          // Используем двойной requestAnimationFrame для избежания forced reflow
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              filterSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })
          })
        }}
      />

      <MortgageCalculator 
        isOpen={isMortgageCalculatorOpen} 
        onClose={() => setIsMortgageCalculatorOpen(false)} 
      />
    </div>
  )
}

export default HomePage

