import React, { useState, useMemo } from 'react'
import CustomInput from './CustomInput'

const MortgageCalculator = ({ isOpen, onClose, initialPrice = '' }) => {
  const [formData, setFormData] = useState({
    propertyPrice: initialPrice || '',
    downPayment: '',
    loanTerm: '20',
    interestRate: '8.5',
  })

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

    return {
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      overpayment: Math.round(overpayment),
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full shadow-xl my-8">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Калькулятор ипотеки</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Параметры кредита</h3>
              
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
                <div className="flex gap-2 mt-2">
                  {[10, 15, 20, 30].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => handleDownPaymentPercent(percent)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary-500 transition"
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Срок кредита */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Срок кредита (лет)
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20, 25, 30].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, loanTerm: term.toString() }))}
                      className={`flex-1 px-4 py-2 border rounded-lg transition ${
                        formData.loanTerm === term.toString()
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 hover:bg-primary-50 hover:border-primary-500'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <CustomInput
                  type="number"
                  value={formData.loanTerm}
                  onChange={(e) => setFormData(prev => ({ ...prev, loanTerm: e.target.value }))}
                  placeholder="20"
                  className="mt-2"
                />
              </div>

              {/* Процентная ставка */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Процентная ставка (% годовых)
                </label>
                <div className="flex gap-2 mb-2">
                  {[7.5, 8.0, 8.5, 9.0, 9.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, interestRate: rate.toString() }))}
                      className={`flex-1 px-3 py-2 text-sm border rounded-lg transition ${
                        formData.interestRate === rate.toString()
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 hover:bg-primary-50 hover:border-primary-500'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
                <CustomInput
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                  placeholder="8.5"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Результаты расчета</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Сумма кредита</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(calculations.loanAmount)} ₽
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Ежемесячный платеж</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatNumber(calculations.monthlyPayment)} ₽
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Общая сумма выплат</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(calculations.totalPayment)} ₽
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Переплата</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatNumber(calculations.overpayment)} ₽
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Здесь можно добавить логику отправки заявки
                    alert('Заявка на ипотеку будет отправлена менеджеру')
                    onClose()
                  }}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Оставить заявку на ипотеку
                </button>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MortgageCalculator

