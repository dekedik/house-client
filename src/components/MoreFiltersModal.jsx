import React, { useState, useEffect } from 'react'
import CustomInput from './CustomInput'

const MoreFiltersModal = ({ isOpen, onClose, filters, onApply }) => {
  const [localFilters, setLocalFilters] = useState({
    areaMin: '',
    areaMax: '',
    priceFromMin: '',
    priceFromMax: '',
  })

  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        areaMin: filters.areaMin || '',
        areaMax: filters.areaMax || '',
        priceFromMin: filters.priceFromMin || '',
        priceFromMax: filters.priceFromMax || '',
      })
    }
  }, [isOpen, filters])

  const handleChange = (name, value) => {
    setLocalFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  const handleReset = () => {
    const emptyFilters = {
      areaMin: '',
      areaMax: '',
      priceFromMin: '',
      priceFromMax: '',
    }
    setLocalFilters(emptyFilters)
    onApply(emptyFilters)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Больше фильтров</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Площадь */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Площадь квартиры (м²)</h3>
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  type="number"
                  value={localFilters.areaMin}
                  onChange={(e) => handleChange('areaMin', e.target.value)}
                  placeholder="От"
                />
                <CustomInput
                  type="number"
                  value={localFilters.areaMax}
                  onChange={(e) => handleChange('areaMax', e.target.value)}
                  placeholder="До"
                />
              </div>
            </div>

            {/* Цена от */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Цена от (₽)</h3>
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  type="number"
                  value={localFilters.priceFromMin}
                  onChange={(e) => handleChange('priceFromMin', e.target.value)}
                  placeholder="От"
                />
                <CustomInput
                  type="number"
                  value={localFilters.priceFromMax}
                  onChange={(e) => handleChange('priceFromMax', e.target.value)}
                  placeholder="До"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Сбросить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoreFiltersModal

