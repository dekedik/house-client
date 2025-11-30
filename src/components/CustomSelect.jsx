import React, { useState, useRef, useEffect } from 'react'

const CustomSelect = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Выберите...',
  error,
  required = false,
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

  const handleSelect = (optionValue) => {
    onChange({ target: { name: props.name, value: optionValue } })
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          name={props.name}
          id={props.id}
          className={`
            w-full px-4 py-3 
            border rounded-lg 
            bg-white
            text-left
            flex items-center justify-between
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}
          `}
        >
          <span className="truncate">{displayValue}</span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Нет вариантов
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full px-4 py-3 text-left
                      transition-colors duration-150
                      hover:bg-primary-50
                      ${value === option.value 
                        ? 'bg-primary-100 text-primary-700 font-medium' 
                        : 'text-gray-900'
                      }
                      ${option.value === '' ? 'text-gray-400' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {value === option.value && (
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default CustomSelect

