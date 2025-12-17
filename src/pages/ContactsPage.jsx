import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const ContactsPage = React.memo(() => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [mapLoading, setMapLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    
    // Загружаем скрипт Яндекс карт асинхронно, не блокируя рендер
    const loadMap = () => {
      if (!window.ymaps) {
        const script = document.createElement('script')
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
        
        script.onload = () => {
          if (!isMounted) return
          window.ymaps.ready(() => {
            if (!isMounted) return
            initMap()
            setMapLoading(false)
          })
        }
        
        script.onerror = () => {
          if (!isMounted) return
          setMapLoading(false)
        }
      } else {
        window.ymaps.ready(() => {
          if (!isMounted) return
          initMap()
          setMapLoading(false)
        })
      }
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current || !isMounted) return

      // Координаты: проспект Михаила Нагибина, 38
      const coordinates = [47.264380, 39.721714]

      try {
        // Создаем карту
        mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
          center: coordinates,
          zoom: 16,
          controls: ['zoomControl', 'fullscreenControl']
        })

        // Добавляем метку
        const placemark = new window.ymaps.Placemark(
          coordinates,
          {
            balloonContent: 'проспект Михаила Нагибина, 38, Ростов-на-Дону, 344068',
            hintContent: 'Наш офис'
          },
          {
            preset: 'islands#blueDotIcon'
          }
        )

        mapInstanceRef.current.geoObjects.add(placemark)
      } catch (error) {
        console.error('Ошибка инициализации карты:', error)
        setMapLoading(false)
      }
    }

    // Загружаем карту с небольшой задержкой, чтобы не блокировать рендер
    const timer = setTimeout(() => {
      loadMap()
    }, 100)

    // Очистка при размонтировании
    return () => {
      isMounted = false
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy()
        } catch (e) {
          // Игнорируем ошибки при уничтожении
        }
        mapInstanceRef.current = null
      }
    }
  }, [])

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
                  проспект Михаила Нагибина, д.38
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Режим работы</h2>
            <div className="space-y-2 text-gray-600">
              <p className="text-lg"><span className="font-semibold">Понедельник - Пятница:</span> 9:00 - 19:00</p>
              <p className="text-lg"><span className="font-semibold">Суббота:</span> 10:00 - 17:00</p>
              <p className="text-lg"><span className="font-semibold">Воскресенье:</span> Выходной</p>
            </div>
          </div>

          {/* Яндекс карта */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Как нас найти</h2>
            <div 
              ref={mapRef}
              className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 relative"
              style={{ minHeight: '400px' }}
            >
              {mapLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-2 text-gray-600 text-sm">Загрузка карты...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
})

ContactsPage.displayName = 'ContactsPage'

export default ContactsPage

