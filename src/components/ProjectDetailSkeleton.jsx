import React from 'react'

const ProjectDetailSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-1"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Main Image Section Skeleton */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <div className="relative h-96 rounded-xl overflow-hidden mb-4 bg-gray-200"></div>
              {/* Thumbnail images */}
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 rounded-lg bg-gray-200"></div>
                <div className="h-24 rounded-lg bg-gray-200"></div>
                <div className="h-24 rounded-lg bg-gray-200"></div>
              </div>
            </div>

            {/* Sidebar Info Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Back button */}
                <div className="mb-4 h-5 bg-gray-200 rounded w-20"></div>
                
                {/* Title */}
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>

                {/* Price */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-10 bg-gray-200 rounded w-40 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section Skeleton */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            
            {/* Description text */}
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>

            {/* Characteristics and Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Characteristics */}
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(7)].map((_, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="h-8 bg-white bg-opacity-20 rounded w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-white bg-opacity-20 rounded w-96 mx-auto mb-8"></div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="h-12 bg-white bg-opacity-20 rounded-lg w-48"></div>
            <div className="h-12 bg-white bg-opacity-20 rounded-lg w-48"></div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProjectDetailSkeleton









