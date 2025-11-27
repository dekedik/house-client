import React, { useState } from 'react'
import CustomInput from './CustomInput'
import CustomSelect from './CustomSelect'

const CallbackModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reason: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Валидация номера телефона
  const validatePhone = (phone) => {
    // Удаляем все нецифровые символы для проверки
    const digitsOnly = phone.replace(/\D/g, '')
    // Проверяем, что номер содержит от 10 до 15 цифр
    return digitsOnly.length >= 10 && digitsOnly.length <= 15
  }

  // Форматирование номера телефона при вводе
  const formatPhone = (value) => {
    // Удаляем все нецифровые символы
    const digitsOnly = value.replace(/\D/g, '')
    
    // Форматируем как +7 (XXX) XXX-XX-XX для российских номеров
    if (digitsOnly.length === 0) return ''
    if (digitsOnly.length <= 1) return `+${digitsOnly}`
    if (digitsOnly.length <= 4) return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1)}`
    if (digitsOnly.length <= 7) return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4)}`
    if (digitsOnly.length <= 9) return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`
    return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 9)}-${digitsOnly.slice(9, 11)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      const formatted = formatPhone(value)
      setFormData(prev => ({ ...prev, [name]: formatted }))
      // Очищаем ошибку при вводе
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: '' }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      // Очищаем ошибку при вводе
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}

    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа'
    }

    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона'
    }

    // Валидация причины обращения
    if (!formData.reason) {
      newErrors.reason = 'Выберите причину обращения'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Отправка формы
    setIsSubmitting(true)
    
    // Имитация отправки (в реальном приложении здесь будет API запрос)
    setTimeout(() => {
      console.log('Форма отправлена:', formData)
      setIsSubmitting(false)
      // Очистка формы
      setFormData({ name: '', phone: '', reason: '' })
      setErrors({})
      // Закрытие модального окна
      onClose()
      // Здесь можно показать уведомление об успешной отправке
      alert('Спасибо! Мы свяжемся с вами в ближайшее время.')
    }, 1000)
  }

  const handleClose = () => {
    setFormData({ name: '', phone: '', reason: '' })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Заказать звонок</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Имя */}
            <CustomInput
              label="Ваше имя"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите ваше имя"
              error={errors.name}
              required
            />

            {/* Телефон */}
            <CustomInput
              label="Номер телефона"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              error={errors.phone}
              required
            />

            {/* Select */}
            <CustomSelect
              label="Причина обращения"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              options={[
                { value: '', label: 'Выберите причину обращения' },
                { value: 'ипотека', label: 'Ипотека' },
                { value: 'наличка', label: 'Наличка' },
                { value: 'рассрочка', label: 'Рассрочка' },
              ]}
              placeholder="Выберите причину обращения"
              error={errors.reason}
              required
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CallbackModal


