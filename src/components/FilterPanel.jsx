import React, { useState } from 'react'
import MoreFiltersModal from './MoreFiltersModal'
import CustomSelect from './CustomSelect'

const FilterPanel = ({ onFilterChange }) => {
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
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false)

  const districts = [
    { value: '', label: 'Все районы' },
    { value: 'Ленинский район', label: 'Ленинский район' },
    { value: 'Кировский район', label: 'Кировский район' },
    { value: 'Первомайский район', label: 'Первомайский район' },
    { value: 'Железнодорожный район', label: 'Железнодорожный район' },
    { value: 'Советский район', label: 'Советский район' },
    { value: 'Октябрьский район', label: 'Октябрьский район' },
    { value: 'Ворошиловский район', label: 'Ворошиловский район' },
    { value: 'Пролетарский район', label: 'Пролетарский район' },
    { value: 'Область и другие регионы', label: 'Область и другие регионы' },
    { value: 'Вторичный рынок', label: 'Вторичный рынок' },
  ]
  const housingClasses = [
    { value: '', label: 'Любой класс' },
    { value: 'Эконом', label: 'Эконом' },
    { value: 'Комфорт', label: 'Комфорт' },
    { value: 'Комфорт +', label: 'Комфорт +' },
    { value: 'Премиум', label: 'Премиум' },
  ]
  const housingTypes = [
    { value: '', label: 'Любой тип' },
    { value: 'Студия', label: 'Студия' },
    { value: '1 спальня', label: '1 спальня' },
    { value: '2 спальни', label: '2 спальни' },
    { value: '3 спальни', label: '3 спальни' },
    { value: 'Более 4 спален', label: 'Более 4 спален' },
  ]
  const statuses = [
    { value: '', label: 'Все статусы' },
    { value: 'Сданные', label: 'Сданные' },
    { value: 'Строятся', label: 'Строятся' },
    { value: 'Старт продаж', label: 'Старт продаж' },
  ]

  const handleChange = (name, e) => {
    const value = e.target ? e.target.value : e
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleMoreFiltersApply = (moreFilters) => {
    const newFilters = { ...filters, ...moreFilters }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const emptyFilters = {
      district: '',
      housingClass: '',
      housingType: '',
      status: '',
      areaMin: '',
      areaMax: '',
      priceFromMin: '',
      priceFromMax: '',
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Фильтры</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMoreFiltersOpen(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>Больше фильтров</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={resetFilters}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Сбросить
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Район */}
          <CustomSelect
            label="Район"
            value={filters.district}
            onChange={(e) => handleChange('district', e)}
            options={districts}
            placeholder="Все районы"
          />

          {/* Класс жилья */}
          <CustomSelect
            label="Класс жилья"
            value={filters.housingClass}
            onChange={(e) => handleChange('housingClass', e)}
            options={housingClasses}
            placeholder="Любой класс"
          />

          {/* Тип жилья */}
          <CustomSelect
            label="Тип жилья"
            value={filters.housingType}
            onChange={(e) => handleChange('housingType', e)}
            options={housingTypes}
            placeholder="Любой тип"
          />

          {/* Статус */}
          <CustomSelect
            label="Статус"
            value={filters.status}
            onChange={(e) => handleChange('status', e)}
            options={statuses}
            placeholder="Все статусы"
          />
        </div>
      </div>

      <MoreFiltersModal
        isOpen={isMoreFiltersOpen}
        onClose={() => setIsMoreFiltersOpen(false)}
        filters={filters}
        onApply={handleMoreFiltersApply}
      />
    </>
  )
}

export default FilterPanel


