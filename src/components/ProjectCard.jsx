import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { optimizeImageUrl } from '../utils/imageOptimizer'

const ProjectCard = ({ project, isFirstProject = false }) => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleDetailsClick = () => {
    navigate(`/project/${project.id}`)
  }

  // Функция для форматирования цены с пробелами между каждыми тремя цифрами
  const formatPrice = (price) => {
    if (!price || price === 'Не указана') return price
    
    // Извлекаем число из строки (убираем пробелы, символы валюты и т.д.)
    const numStr = price.toString().replace(/\s/g, '').replace(/[^\d]/g, '')
    if (!numStr) return price
    
    // Форматируем число с пробелами
    const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    
    // Проверяем, был ли символ валюты в исходной строке
    const hasCurrency = price.includes('₽') || price.includes('руб')
    return hasCurrency ? `${formatted} ₽` : formatted
  }

  // Функция для форматирования комнат
  const formatRooms = (rooms) => {
    if (!rooms) return ''
    
    // Если это строка, возвращаем как есть
    if (typeof rooms === 'string') return rooms
    
    // Если это массив
    if (Array.isArray(rooms)) {
      if (rooms.length === 0) return ''
      if (rooms.length === 1) return rooms[0]
      
      // Разделяем на студии и квартиры с номерами
      const studios = rooms.filter(r => r.toLowerCase().includes('студия'))
      const numbered = rooms.filter(r => !r.toLowerCase().includes('студия'))
      
      const result = []
      
      // Добавляем студии
      if (studios.length > 0) {
        result.push(studios.join(', '))
      }
      
      // Обрабатываем квартиры с номерами
      if (numbered.length > 0) {
        // Извлекаем числа из строк типа "1к", "2к" и т.д.
        const numbers = numbered.map(r => {
          const match = r.match(/(\d+)/)
          return match ? parseInt(match[1]) : null
        }).filter(n => n !== null).sort((a, b) => a - b)
        
        if (numbers.length > 0) {
          // Проверяем, идут ли числа подряд
          const isConsecutive = numbers.length > 1 && 
            numbers.every((num, idx) => idx === 0 || num === numbers[idx - 1] + 1)
          
          if (isConsecutive && numbers.length > 2) {
            // Если идут подряд и их больше 2, делаем диапазон
            result.push(`${numbers[0]}к-${numbers[numbers.length - 1]}к`)
          } else {
            // Иначе через запятую
            result.push(numbered.join(', '))
          }
        }
      }
      
      return result.join(', ')
    }
    
    return rooms
  }
  
  // Обрабатываем images - может быть массивом, строкой JSON или отсутствовать
  let images = []
  if (project.images) {
    if (Array.isArray(project.images)) {
      images = project.images
    } else if (typeof project.images === 'string') {
      try {
        images = JSON.parse(project.images)
      } catch (e) {
        images = []
      }
    }
  }
  
  // Если нет images, используем image
  if (images.length === 0 && project.image) {
    images = [project.image]
  }
  
  // Оптимизируем изображения для мобильных устройств
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const optimizedImages = useMemo(() => {
    return images.map(img => {
      if (isMobile && img && img.includes('unsplash.com')) {
        try {
          return optimizeImageUrl(img, { width: 400, height: 192, quality: 70 })
        } catch (e) {
          return img
        }
      }
      return img
    })
  }, [images, isMobile])
  
  const mainImage = optimizedImages[0] || project.image || ''
  const sideImage = optimizedImages[1] || null // Одно изображение справа
  const bottomImage = optimizedImages[2] || null // Изображение под основным
  const hasMoreImages = optimizedImages.length > 3
  const currentImage = optimizedImages[currentImageIndex] || mainImage

  // Сбрасываем индекс при изменении проекта
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [project.id])

  // Поддержка клавиатурной навигации для десктопа
  useEffect(() => {
    if (optimizedImages.length <= 1) return
    
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev === 0 ? optimizedImages.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev === optimizedImages.length - 1 ? 0 : prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [optimizedImages.length])

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? optimizedImages.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === optimizedImages.length - 1 ? 0 : prev + 1))
  }

  const handleDotClick = (index, e) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  // Обработка свайпа для мобильных устройств
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      // Свайп влево - следующее изображение
      setCurrentImageIndex((prev) => (prev === optimizedImages.length - 1 ? 0 : prev + 1))
    } else if (distance < -minSwipeDistance) {
      // Свайп вправо - предыдущее изображение
      setCurrentImageIndex((prev) => (prev === 0 ? optimizedImages.length - 1 : prev - 1))
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  // Предзагрузка изображений для плавного переключения (только текущее + соседние)
  useEffect(() => {
    if (optimizedImages.length <= 1) return
    
    // Предзагружаем только текущее изображение и соседние (предыдущее и следующее)
    const imagesToPreload = new Set()
    
    // Текущее изображение
    if (optimizedImages[currentImageIndex]) {
      imagesToPreload.add(optimizedImages[currentImageIndex])
    }
    
    // Предыдущее изображение
    const prevIndex = currentImageIndex === 0 ? optimizedImages.length - 1 : currentImageIndex - 1
    if (optimizedImages[prevIndex]) {
      imagesToPreload.add(optimizedImages[prevIndex])
    }
    
    // Следующее изображение
    const nextIndex = currentImageIndex === optimizedImages.length - 1 ? 0 : currentImageIndex + 1
    if (optimizedImages[nextIndex]) {
      imagesToPreload.add(optimizedImages[nextIndex])
    }
    
    // Предзагружаем только нужные изображения
    imagesToPreload.forEach((imageUrl) => {
      if (imageUrl) {
        const img = new Image()
        img.src = imageUrl
      }
    })
  }, [images, currentImageIndex])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-stretch md:h-[320px]">
        {/* Блок с изображениями - первым в мобильной версии */}
        {mainImage && (
          <div className="md:w-2/5 flex-shrink-0 p-2 md:p-4 flex items-stretch order-1 md:order-2">
            {/* Мобильный слайдер */}
            {optimizedImages.length > 1 ? (
              <div className="md:hidden relative rounded-lg overflow-hidden w-full" style={{ height: '192px' }}>
                <div 
                  className="relative w-full h-full"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{ height: '192px', width: '100%' }}
                >
                  <img
                    key={`mobile-${currentImageIndex}-${currentImage}`}
                    src={currentImage}
                    alt={`${project.name} ${currentImageIndex + 1}`}
                    className="select-none"
                    style={{ width: '100%', height: '192px', objectFit: 'cover', display: 'block' }}
                    width="400"
                    height="192"
                    sizes="(max-width: 768px) 100vw, 400px"
                    draggable={false}
                    loading="eager"
                    decoding={isFirstProject && currentImageIndex === 0 ? "sync" : "async"}
                    fetchPriority={isFirstProject && currentImageIndex === 0 ? "high" : "auto"}
                  />
                  {project.status && (
                    <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      {project.status}
                    </span>
                  )}
                  {project.discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      {project.discount}
                    </span>
                  )}
                  
                  {/* Кнопки навигации */}
                  {optimizedImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition z-10"
                        aria-label="Предыдущее изображение"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition z-10"
                        aria-label="Следующее изображение"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Индикаторы (точки) */}
                  {optimizedImages.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {optimizedImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => handleDotClick(index, e)}
                          className={`w-2 h-2 rounded-full transition ${
                            index === currentImageIndex
                              ? 'bg-white'
                              : 'bg-white bg-opacity-50'
                          }`}
                          aria-label={`Перейти к изображению ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="md:hidden relative rounded-lg overflow-hidden w-full" style={{ height: '192px' }}>
                <img
                  src={mainImage}
                  alt={project.name}
                  style={{ width: '100%', height: '192px', objectFit: 'cover', display: 'block' }}
                  width="400"
                  height="192"
                  loading="eager"
                  decoding={isFirstProject ? "sync" : "async"}
                  fetchPriority={isFirstProject ? "high" : "auto"}
                />
                {project.status && (
                  <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {project.status}
                  </span>
                )}
                {project.discount && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {project.discount}
                  </span>
                )}
              </div>
            )}
            
            {/* Десктопная версия - слайдер */}
            {optimizedImages.length > 1 ? (
              <div className="hidden md:block relative rounded-lg overflow-hidden w-full h-full">
                <div className="relative w-full h-full">
                  <img
                    key={`desktop-${currentImageIndex}-${currentImage}`}
                    src={currentImage}
                    alt={`${project.name} ${currentImageIndex + 1}`}
                    className="select-none w-full h-full"
                    style={{ objectFit: 'cover', display: 'block' }}
                    width="512"
                    height="320"
                    sizes="(max-width: 768px) 100vw, 512px"
                    draggable={false}
                    loading="eager"
                    decoding={isFirstProject && currentImageIndex === 0 ? "sync" : "async"}
                    fetchPriority={isFirstProject && currentImageIndex === 0 ? "high" : "auto"}
                  />
                  {project.status && (
                    <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      {project.status}
                    </span>
                  )}
                  {project.discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      {project.discount}
                    </span>
                  )}
                  
                  {/* Кнопки навигации */}
                  {optimizedImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition z-10"
                        aria-label="Предыдущее изображение"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition z-10"
                        aria-label="Следующее изображение"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Индикаторы (точки) */}
                  {optimizedImages.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {optimizedImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => handleDotClick(index, e)}
                          className={`w-2 h-2 rounded-full transition ${
                            index === currentImageIndex
                              ? 'bg-white'
                              : 'bg-white bg-opacity-50'
                          }`}
                          aria-label={`Перейти к изображению ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:block relative rounded-lg overflow-hidden w-full h-full">
                <img
                  src={mainImage}
                  alt={project.name}
                  className="w-full h-full"
                  style={{ objectFit: 'cover', display: 'block' }}
                  width="512"
                  height="320"
                  loading="eager"
                  decoding={isFirstProject ? "sync" : "async"}
                  fetchPriority={isFirstProject ? "high" : "auto"}
                />
                {project.status && (
                  <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {project.status}
                  </span>
                )}
                {project.discount && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {project.discount}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Блок с информацией - вторым в мобильной версии */}
        <div className="flex-1 p-4 md:p-6 flex flex-col order-2 md:order-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{project.name}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base text-gray-500">{project.district}</span>
                {(project.housingClass || project.housing_class) && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-base text-primary-600 font-medium">
                      {project.housingClass || project.housing_class}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-base mb-3 line-clamp-2 flex-1">{project.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div>
              <p className="text-gray-500 text-base mb-1">Цена от</p>
              <p className="text-xl font-bold text-primary-600">
                {formatPrice(project.priceFrom || project.price_from || 'Не указана')}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-base mb-1">Срок сдачи</p>
              <p className="text-base font-semibold text-gray-800">{project.completion}</p>
            </div>
            {(project.rooms_available) && (
              <div>
                <p className="text-gray-500 text-base mb-1">Комнаты</p>
                <p className="text-base font-semibold text-gray-800">
                  {formatRooms(project.rooms_available)}
                </p>
              </div>
            )}
            {project.area && (
              <div>
                <p className="text-gray-500 text-base mb-1">Площадь</p>
                <p className="text-base font-semibold text-gray-800">{project.area}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <button 
              onClick={handleDetailsClick}
              className="bg-primary-600 text-white py-2.5 px-6 rounded-lg hover:bg-primary-700 transition font-medium text-base"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard


