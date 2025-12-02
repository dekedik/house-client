import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()

  const handleDetailsClick = () => {
    navigate(`/project/${project.id}`)
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
  
  const mainImage = images[0] || project.image || ''
  const sideImage = images[1] || null // Одно изображение справа
  const bottomImage = images[2] || null // Изображение под основным
  const hasMoreImages = images.length > 3

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Блок с информацией */}
        <div className="flex-1 p-4 md:p-6 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{project.name}</h3>
              <span className="text-base text-gray-500">{project.district}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-base mb-3 line-clamp-2 flex-1">{project.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div>
              <p className="text-gray-500 text-base mb-1">Цена от</p>
              <p className="text-xl font-bold text-primary-600">
                {project.priceFrom || project.price_from || 'Не указана'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-base mb-1">Срок сдачи</p>
              <p className="text-base font-semibold text-gray-800">{project.completion}</p>
            </div>
            {project.rooms && (
              <div>
                <p className="text-gray-500 text-base mb-1">Комнаты</p>
                <p className="text-base font-semibold text-gray-800">{project.rooms}</p>
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
        
        {/* Блок с изображениями */}
        {mainImage && (
          <div className="md:w-2/5 flex-shrink-0 p-2 md:p-4">
            <div className="relative grid grid-cols-3 gap-1 h-48 md:h-full md:min-h-[200px] overflow-hidden rounded-lg">
              {/* Большое основное изображение */}
              <div className={`${sideImage ? "col-span-2" : "col-span-3"} relative overflow-hidden`}>
                <img
                  src={mainImage}
                  alt={project.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
              
              {/* Правая колонка с одним изображением */}
              {sideImage && (
                <div className="col-span-1 relative overflow-hidden">
                  <img
                    src={sideImage}
                    alt={`${project.name} 2`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard


