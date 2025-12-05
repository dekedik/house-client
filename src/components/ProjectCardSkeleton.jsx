import React from 'react'

const ProjectCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Блок с изображением */}
        <div className="md:w-2/5 flex-shrink-0 p-2 md:p-4 flex items-stretch order-1 md:order-2">
          <div className="w-full h-48 md:h-full rounded-lg bg-gray-200"></div>
        </div>
        
        {/* Блок с информацией */}
        <div className="flex-1 p-4 md:p-6 flex flex-col order-2 md:order-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="h-7 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          
          <div className="space-y-2 mb-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-5 bg-gray-200 rounded w-28"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCardSkeleton

