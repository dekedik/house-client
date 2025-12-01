import React, { useState } from 'react'
import CustomSelect from './CustomSelect'

const ApartmentFinder = ({ isOpen, onClose, onApplyFilters }) => {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    district: '',
    paymentType: '',
    rooms: '',
  })

  const districts = [
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

  const paymentTypes = [
    { value: 'ипотека', label: 'Ипотека' },
    { value: 'рассрочка', label: 'Рассрочка' },
    { value: 'наличные', label: 'Наличные' },
  ]

  const roomsOptions = [
    { value: 'Студия', label: 'Студия' },
    { value: '1 спальня', label: '1 спальня' },
    { value: '2 спальни', label: '2 спальни' },
    { value: '3 спальни', label: '3 спальни' },
    { value: 'Более 4 спален', label: 'Более 4 спален' },
  ]

  const handleChange = (name, value) => {
    setAnswers(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFinish = () => {
    // Преобразуем ответы в фильтры
    const filters = {
      district: answers.district || '',
      status: '',
      housingClass: '',
      housingType: answers.rooms || '',
      areaMin: '',
      areaMax: '',
      priceFromMin: '',
      priceFromMax: '',
    }

    // Если выбран вторичный рынок, не применяем фильтр по району
    if (answers.district === 'Вторичный рынок') {
      filters.district = ''
    }

    // Применяем фильтры
    onApplyFilters(filters)
    
    // Закрываем модальное окно
    onClose()
    
    // Сбрасываем состояние
    setStep(1)
    setAnswers({ district: '', paymentType: '', rooms: '' })
  }

  const handleClose = () => {
    setStep(1)
    setAnswers({ district: '', paymentType: '', rooms: '' })
    onClose()
  }

  if (!isOpen) return null

  const isStepValid = () => {
    if (step === 1) return answers.district !== ''
    if (step === 2) return answers.paymentType !== ''
    if (step === 3) return answers.rooms !== ''
    return false
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Подобрать квартиру</h2>
              <p className="text-sm text-gray-500 mt-1">Шаг {step} из 3</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center">
              {[1, 2, 3].map((num) => (
                <React.Fragment key={num}>
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        step >= num
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {num}
                    </div>
                  </div>
                  {num < 3 && (
                    <div
                      className={`h-1 w-full mx-2 ${
                        step > num ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-6 min-h-[200px]">
            {step === 1 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  1. Какой район рассматриваете для приобретения?
                </h3>
                <CustomSelect
                  label=""
                  name="district"
                  value={answers.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  options={[
                    { value: '', label: 'Выберите район' },
                    ...districts,
                  ]}
                  placeholder="Выберите район"
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  2. Вид оплаты
                </h3>
                <CustomSelect
                  label=""
                  name="paymentType"
                  value={answers.paymentType}
                  onChange={(e) => handleChange('paymentType', e.target.value)}
                  options={[
                    { value: '', label: 'Выберите вид оплаты' },
                    ...paymentTypes,
                  ]}
                  placeholder="Выберите вид оплаты"
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  3. Количество комнат
                </h3>
                <CustomSelect
                  label=""
                  name="rooms"
                  value={answers.rooms}
                  onChange={(e) => handleChange('rooms', e.target.value)}
                  options={[
                    { value: '', label: 'Выберите количество комнат' },
                    ...roomsOptions,
                  ]}
                  placeholder="Выберите количество комнат"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Подобрать
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApartmentFinder

