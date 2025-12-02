import React, { useState, useMemo, useEffect } from 'react'
import CustomInput from './CustomInput'
import { api } from '../services/api'

const MortgageCalculator = ({ isOpen, onClose, initialPrice = '', projectId = null }) => {
  const [step, setStep] = useState(1) // 1 - калькулятор, 2 - форма контактов
  const [formData, setFormData] = useState({
    propertyPrice: initialPrice || '',
    downPayment: '',
    loanTerm: '20',
    interestRate: '8.5',
  })
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Сбрасываем шаг при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setContactData({ name: '', phone: '' })
      setErrors({})
      setIsSuccess(false)
    }
  }, [isOpen])

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num)
  }

  const parseNumber = (str) => {
    return parseInt(str.toString().replace(/\s/g, '')) || 0
  }

  const calculations = useMemo(() => {
    const price = parseNumber(formData.propertyPrice)
    const downPayment = parseNumber(formData.downPayment)
    const loanAmount = Math.max(0, price - downPayment)
    const term = parseInt(formData.loanTerm) || 20
    const rate = parseFloat(formData.interestRate) || 8.5
    const monthlyRate = rate / 100 / 12
    const months = term * 12

    if (loanAmount <= 0 || months <= 0 || monthlyRate <= 0) {
      return {
        loanAmount: 0,
        monthlyPayment: 0,
        totalPayment: 0,
        overpayment: 0,
      }
    }

    // Формула аннуитетного платежа
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const totalPayment = monthlyPayment * months
    const overpayment = totalPayment - loanAmount

    const MAX_VALUE = 500000000 // Максимальное значение для отображения

    return {
      loanAmount: Math.min(loanAmount, MAX_VALUE),
      monthlyPayment: Math.min(Math.round(monthlyPayment), MAX_VALUE),
      totalPayment: Math.min(Math.round(totalPayment), MAX_VALUE),
      overpayment: Math.min(Math.round(overpayment), MAX_VALUE),
    }
  }, [formData])

  const handleChange = (name, value) => {
    // Форматирование чисел при вводе
    if (name === 'propertyPrice' || name === 'downPayment') {
      const numValue = value.replace(/\s/g, '').replace(/[^\d]/g, '')
      const formatted = numValue ? formatNumber(numValue) : ''
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDownPaymentPercent = (percent) => {
    const price = parseNumber(formData.propertyPrice)
    if (price > 0) {
      const downPayment = Math.round(price * percent / 100)
      setFormData(prev => ({ ...prev, downPayment: formatNumber(downPayment) }))
    }
  }

  // Валидация номера телефона
  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '')
    return digitsOnly.length >= 10 && digitsOnly.length <= 15
  }

  // Форматирование номера телефона
  const formatPhoneInput = (value) => {
    const digitsOnly = value.replace(/\D/g, '')
    if (digitsOnly.length === 0) return ''
    if (digitsOnly.length <= 1) return `+${digitsOnly}`
    if (digitsOnly.length <= 4) return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1)}`
    if (digitsOnly.length <= 7) return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4)}`
    if (digitsOnly.length <= 9) return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`
    return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 9)}-${digitsOnly.slice(9, 11)}`
  }

  const handleContactChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      const formatted = formatPhoneInput(value)
      setContactData(prev => ({ ...prev, [name]: formatted }))
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: '' }))
      }
    } else {
      setContactData(prev => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const handleNext = () => {
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = {}

    // Валидация имени
    if (!contactData.name.trim()) {
      newErrors.name = 'Введите ваше имя'
    } else if (contactData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа'
    }

    // Валидация телефона
    if (!contactData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона'
    } else if (!validatePhone(contactData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Отправляем заявку на ипотеку
      const submitData = {
        name: contactData.name.trim(),
        phone: contactData.phone.trim(),
        reason: 'ипотека',
        project_id: projectId || null,
        notes: `Заявка на ипотеку. Параметры: стоимость ${formData.propertyPrice}, первоначальный взнос ${formData.downPayment}, срок ${formData.loanTerm} лет, ставка ${formData.interestRate}%`,
      }

      await api.submitCallback(submitData)

      // Успешная отправка
      setIsSuccess(true)
      setContactData({ name: '', phone: '' })
      setErrors({})
      
      // Автоматически закрываем через 3 секунды
      setTimeout(() => {
        setIsSuccess(false)
        setStep(1)
        onClose()
      }, 3000)
    } catch (err) {
      console.error('Ошибка при отправке заявки:', err)
      setErrors({ 
        submit: err.message || 'Не удалось отправить заявку. Попробуйте позже.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl my-2 sm:my-8 max-h-[95vh] overflow-y-auto">
        <div className="p-2 sm:p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">
              {step === 1 ? 'Калькулятор ипотеки' : 'Оставить заявку на ипотеку'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-6 lg:gap-8">
            {/* Input Section */}
            <div className="space-y-2 sm:space-y-4 md:space-y-5">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800">Параметры кредита</h3>
              
              {/* Стоимость квартиры */}
              <CustomInput
                label="Стоимость квартиры"
                type="text"
                value={formData.propertyPrice}
                onChange={(e) => handleChange('propertyPrice', e.target.value)}
                placeholder="10 000 000"
                required
              />

              {/* Первоначальный взнос */}
              <div>
                <CustomInput
                  label="Первоначальный взнос"
                  type="text"
                  value={formData.downPayment}
                  onChange={(e) => handleChange('downPayment', e.target.value)}
                  placeholder="2 000 000"
                />
                <div className="flex gap-1.5 sm:gap-2 mt-2">
                  {[10, 15, 20, 30].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => handleDownPaymentPercent(percent)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary-500 transition"
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Срок кредита */}
              <div>
                <CustomInput
                  label="Срок кредита (лет)"
                  type="number"
                  value={formData.loanTerm}
                  onChange={(e) => setFormData(prev => ({ ...prev, loanTerm: e.target.value }))}
                  placeholder="20"
                />
                <div className="flex gap-1.5 sm:gap-2 mt-2 flex-wrap">
                  {[5, 10, 15, 20, 25, 30].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, loanTerm: term.toString() }))}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-lg transition ${
                        formData.loanTerm === term.toString()
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 hover:bg-primary-50 hover:border-primary-500'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Процентная ставка */}
              <div>
                <CustomInput
                  label="Процентная ставка (% годовых)"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                  placeholder="8.5"
                />
                <div className="flex gap-1.5 sm:gap-2 mt-2 flex-wrap">
                  {[7.5, 8.0, 8.5, 9.0, 9.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, interestRate: rate.toString() }))}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-lg transition ${
                        formData.interestRate === rate.toString()
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 hover:bg-primary-50 hover:border-primary-500'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-50 rounded-lg p-2 sm:p-4 md:p-6">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4 md:mb-6">Результаты расчета</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-3 md:gap-4 lg:space-y-0">
                <div className="bg-white rounded-lg p-1.5 sm:p-3 md:p-4 border border-gray-200">
                  <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Сумма кредита</p>
                  <p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 break-words">
                    {formatNumber(calculations.loanAmount)} ₽
                  </p>
                </div>

                <div className="bg-white rounded-lg p-1.5 sm:p-3 md:p-4 border border-gray-200">
                  <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Ежемесячный платеж</p>
                  <p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-primary-600 break-words">
                    {formatNumber(calculations.monthlyPayment)} ₽
                  </p>
                </div>

                <div className="bg-white rounded-lg p-1.5 sm:p-3 md:p-4 border border-gray-200">
                  <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Общая сумма выплат</p>
                  <p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 break-words">
                    {formatNumber(calculations.totalPayment)} ₽
                  </p>
                </div>

                <div className="bg-white rounded-lg p-1.5 sm:p-3 md:p-4 border border-gray-200">
                  <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Переплата</p>
                  <p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-red-600 break-words">
                    {formatNumber(calculations.overpayment)} ₽
                  </p>
                </div>
              </div>

              <div className="mt-2 sm:mt-5 md:mt-6 pt-2 sm:pt-5 md:pt-6 border-t border-gray-200">
                <button
                  onClick={handleNext}
                  className="w-full bg-primary-600 text-white py-1.5 sm:py-2.5 md:py-3 rounded-lg hover:bg-primary-700 transition font-semibold text-xs sm:text-base"
                >
                  Далее
                </button>
              </div>
            </div>
          </div>
          ) : isSuccess ? (
            /* Success State */
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Заявка успешно отправлена!</h3>
              <p className="text-gray-600 mb-6">
                Спасибо! Ваша заявка на ипотеку отправлена. Мы свяжемся с вами в ближайшее время.
              </p>
            <button
                onClick={() => {
                  setIsSuccess(false)
                  setStep(1)
                  onClose()
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Закрыть
            </button>
          </div>
          ) : (
            /* Step 2: Contact Form */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Результаты расчета</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Ежемесячный платеж</p>
                    <p className="text-lg sm:text-xl font-bold text-primary-600">
                      {formatNumber(calculations.monthlyPayment)} ₽
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Сумма кредита</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {formatNumber(calculations.loanAmount)} ₽
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Ваши контактные данные</h3>

              {/* Имя */}
              <CustomInput
                label="Ваше имя"
                type="text"
                name="name"
                value={contactData.name}
                onChange={handleContactChange}
                placeholder="Введите ваше имя"
                error={errors.name}
                required
              />

              {/* Телефон */}
              <CustomInput
                label="Номер телефона"
                type="tel"
                name="phone"
                value={contactData.phone}
                onChange={handleContactChange}
                placeholder="+7 (999) 123-45-67"
                error={errors.phone}
                required
              />

              {/* Сообщение об ошибке отправки */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                  disabled={isSubmitting}
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default MortgageCalculator


