import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import CallbackModal from '../components/CallbackModal'
import MortgageCalculator from '../components/MortgageCalculator'
import ProjectDetailSkeleton from '../components/ProjectDetailSkeleton'

const ProjectDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false)
  const [isMortgageCalculatorOpen, setIsMortgageCalculatorOpen] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Получаем images и features (уже распарсены в API, но проверяем для обратной совместимости)
  // Должно быть объявлено до использования в useEffect
  const projectImages = useMemo(() => {
    if (!project) return []
    if (Array.isArray(project.images)) return project.images
    if (typeof project.images === 'string') {
      try {
        return JSON.parse(project.images)
      } catch {
        return []
      }
    }
    return []
  }, [project?.images])

  const projectFeatures = useMemo(() => {
    if (!project) return []
    if (Array.isArray(project.features)) return project.features
    if (typeof project.features === 'string') {
      try {
        return JSON.parse(project.features)
      } catch {
        return []
      }
    }
    return []
  }, [project?.features])

  // Прокручиваем страницу вверх ДО рендеринга (useLayoutEffect выполняется синхронно)
  useLayoutEffect(() => {
    // Немедленная прокрутка вверх
    window.scrollTo(0, 0)
    if (document.documentElement) {
      document.documentElement.scrollTop = 0
    }
    if (document.body) {
      document.body.scrollTop = 0
    }
  }, [id])

  // Дополнительная прокрутка после рендеринга
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }
    }
    
    // Прокрутка сразу и после задержек для надежности на мобильных
    scrollToTop()
    setTimeout(scrollToTop, 0)
    setTimeout(scrollToTop, 50)
    setTimeout(scrollToTop, 100)
    setTimeout(scrollToTop, 200)
    setTimeout(scrollToTop, 300)
  }, [id])

  useEffect(() => {
    loadProject()
  }, [id])

  // Сбрасываем индекс при изменении проекта
  useEffect(() => {
    setSelectedImage(0)
  }, [id])

  // Предзагрузка изображений для плавного переключения (только текущее + соседние)
  useEffect(() => {
    if (!projectImages || projectImages.length <= 1) return
    
    // Предзагружаем только текущее изображение и соседние (предыдущее и следующее)
    const imagesToPreload = new Set()
    
    // Текущее изображение
    if (projectImages[selectedImage]) {
      imagesToPreload.add(projectImages[selectedImage])
    }
    
    // Предыдущее изображение
    const prevIndex = selectedImage === 0 ? projectImages.length - 1 : selectedImage - 1
    if (projectImages[prevIndex]) {
      imagesToPreload.add(projectImages[prevIndex])
    }
    
    // Следующее изображение
    const nextIndex = selectedImage === projectImages.length - 1 ? 0 : selectedImage + 1
    if (projectImages[nextIndex]) {
      imagesToPreload.add(projectImages[nextIndex])
    }
    
    // Предзагружаем только нужные изображения
    imagesToPreload.forEach((imageUrl) => {
      if (imageUrl) {
        const img = new Image()
        img.src = imageUrl
      }
    })
  }, [projectImages, selectedImage])

  // Поддержка клавиатурной навигации для слайдера
  useEffect(() => {
    if (!projectImages || projectImages.length <= 1) return
    
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [projectImages])

  const loadProject = async () => {
    try {
      setLoading(true)
      const data = await api.getProjectById(id)
      setProject(data)
      setError(null)
      
      // Прокручиваем вверх после загрузки данных
      setTimeout(() => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 0)
    } catch (err) {
      console.error('Ошибка при загрузке проекта:', err)
      setError(err.message || 'Проект не найден')
    } finally {
      setLoading(false)
      
      // Прокручиваем вверх после завершения загрузки
      setTimeout(() => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 0)
    }
  }

  // Обработка свайпа для слайдера изображений
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !projectImages || projectImages.length <= 1) return
    
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      // Свайп влево - следующее изображение
      setSelectedImage((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1))
    } else if (distance < -minSwipeDistance) {
      // Свайп вправо - предыдущее изображение
      setSelectedImage((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1))
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  if (loading) {
    return <ProjectDetailSkeleton />
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {error || 'Проект не найден'}
        </h1>
        <p className="text-gray-600 mb-6">
          {error?.includes('время ожидания') 
            ? 'Сервер не отвечает. Пожалуйста, попробуйте позже.'
            : error?.includes('подключения')
            ? 'Проверьте подключение к интернету и попробуйте снова.'
            : 'Возможно, проект был удален или не существует.'}
        </p>
        <Link 
          to="/" 
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          Вернуться к каталогу
        </Link>
      </div>
    )
  }

  // Функция для форматирования цены с пробелами между каждыми тремя цифрами
  const formatPrice = (price) => {
    if (!price) return price
    
    // Извлекаем число из строки (убираем пробелы, символы валюты и т.д.)
    const numStr = price.toString().replace(/\s/g, '').replace(/[^\d]/g, '')
    if (!numStr) return price
    
    // Форматируем число с пробелами
    const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    
    // Проверяем, был ли символ валюты в исходной строке
    const hasCurrency = price.includes('₽') || price.includes('руб')
    return hasCurrency ? `${formatted} ₽` : formatted
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600">
              Главная
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800">{project.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Image Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div 
                className="relative h-96 rounded-xl overflow-hidden mb-4"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {projectImages.length > 0 ? (
                  <>
                    <img
                      key={`main-${selectedImage}-${projectImages[selectedImage]}`}
                      src={projectImages[selectedImage] || project.image}
                      alt={project.name}
                      className="w-full h-full object-cover select-none"
                      draggable={false}
                      loading="eager"
                    />
                    
                    {/* Кнопки навигации слайдера */}
                    {projectImages.length > 1 && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedImage((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1))
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition z-10"
                          aria-label="Предыдущее изображение"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1))
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition z-10"
                          aria-label="Следующее изображение"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {/* Индикаторы (точки) */}
                    {projectImages.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {projectImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`w-3 h-3 rounded-full transition ${
                              index === selectedImage
                                ? 'bg-white'
                                : 'bg-white bg-opacity-50'
                            }`}
                            aria-label={`Перейти к изображению ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
                
                {project.status && (
                  <span className="absolute top-4 left-4 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                    {project.status}
                  </span>
                )}
                {project.discount && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                    {project.discount}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {projectImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${project.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <p className="text-gray-600">{project.district}</p>
                  {(project.housingClass || project.housing_class) && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-primary-600 font-medium">
                        {project.housingClass || project.housing_class}
                      </span>
                    </>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Цена от</p>
                    <p className="text-3xl font-bold text-primary-600">{formatPrice(project.priceFrom || project.price_from)}</p>
                    <p className="text-sm text-gray-500">от {formatPrice(project.price)} за м²</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Срок сдачи</p>
                        <p className="font-semibold text-gray-800">{project.completion}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Квартир</p>
                        <p className="font-semibold text-gray-800">{project.apartments}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Этажность</p>
                        <p className="font-semibold text-gray-800">{project.floors}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Площадь</p>
                        <p className="font-semibold text-gray-800">{project.area}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => setIsCallbackModalOpen(true)}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                  >
                    Заказать звонок
                  </button>
                  <button 
                    onClick={() => setIsMortgageCalculatorOpen(true)}
                    className="w-full border-2 border-primary-600 text-primary-600 py-3 rounded-lg hover:bg-primary-50 transition font-semibold"
                  >
                    Рассчитать ипотеку
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">О проекте</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {project.fullDescription}
            </p>

            {/* Карточки с основными категориями */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Виды оплаты */}
              {project.payment_types && project.payment_types.length > 0 && (
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Виды оплаты</h3>
                  </div>
                  <ul className="space-y-2">
                    {project.payment_types.map((type, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Виды отделки */}
              {project.design_types && project.design_types.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Виды отделки</h3>
                  </div>
                  <ul className="space-y-2">
                    {project.design_types.map((type, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Количество комнат */}
              {project.rooms_available && project.rooms_available.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Количество комнат</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.rooms_available.map((room, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white text-green-700 font-semibold rounded-lg border border-green-300 text-sm">
                        {room}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Характеристики</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Застройщик</span>
                    <span className="font-semibold text-gray-800">{project.developer}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Район</span>
                    <span className="font-semibold text-gray-800">{project.district}</span>
                  </div>
                  {(project.housingClass || project.housing_class) && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Класс ЖК</span>
                      <span className="font-semibold text-gray-800">{project.housingClass || project.housing_class}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Этажность</span>
                    <span className="font-semibold text-gray-800">{project.floors}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Количество квартир</span>
                    <span className="font-semibold text-gray-800">{project.apartments}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Площадь квартир</span>
                    <span className="font-semibold text-gray-800">{project.area}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Парковка</span>
                    <span className="font-semibold text-gray-800">{project.parking}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Срок сдачи</span>
                    <span className="font-semibold text-gray-800">{project.completion}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Инфраструктура</h3>
                <div className="grid grid-cols-2 gap-3">
                  {projectFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Заинтересовал этот проект?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Свяжитесь с нами, и мы подберем для вас идеальную квартиру
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setIsCallbackModalOpen(true)}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Заказать звонок
            </button>
            <button 
              onClick={() => setIsMortgageCalculatorOpen(true)}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
            >
              Рассчитать ипотеку
            </button>
          </div>
        </div>
      </section>

      <CallbackModal 
        isOpen={isCallbackModalOpen} 
        onClose={() => setIsCallbackModalOpen(false)} 
        projectId={project?.id}
      />

      <MortgageCalculator 
        isOpen={isMortgageCalculatorOpen} 
        onClose={() => setIsMortgageCalculatorOpen(false)}
        initialPrice={project?.priceFrom?.replace(/\s/g, '').replace('₽', '') || ''}
        projectId={project?.id}
      />
    </div>
  )
}

export default ProjectDetailPage

