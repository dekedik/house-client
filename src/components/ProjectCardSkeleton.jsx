import React from 'react'

const ProjectCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Блок с изображением - первым в мобильной версии */}
        <div className="md:w-2/5 flex-shrink-0 p-2 md:p-4 flex items-stretch order-1 md:order-2">
          {/* Мобильная версия */}
          <div className="md:hidden relative rounded-lg overflow-hidden w-full" style={{ height: '192px' }}>
            <div className="w-full h-full bg-gray-200"></div>
          </div>
          
          {/* Десктопная версия */}
          <div className="hidden md:block relative rounded-lg overflow-hidden w-full h-full">
            <div className="w-full h-full bg-gray-200"></div>
          </div>
        </div>
        
        {/* Блок с информацией - вторым в мобильной версии */}
        <div className="flex-1 p-4 md:p-6 flex flex-col order-2 md:order-1 min-h-[280px]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {/* Заголовок - text-xl md:text-2xl */}
              <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4 mb-1"></div>
              {/* Район - text-base */}
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          
          {/* Описание - text-base mb-3 line-clamp-2 flex-1 */}
          <div className="space-y-2 mb-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          {/* Сетка с данными - grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* Цена от - text-xl font-bold */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-6 md:h-7 bg-gray-200 rounded w-24"></div>
            </div>
            {/* Срок сдачи - text-base font-semibold */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-5 bg-gray-200 rounded w-28"></div>
            </div>
            {/* Комнаты - text-base font-semibold */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
            {/* Площадь - text-base font-semibold */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          {/* Кнопка - py-2.5 px-6 */}
          <div className="flex gap-2 mt-auto">
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCardSkeleton
