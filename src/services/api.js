// Базовый URL API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Функция для парсинга JSON полей (images, features)
const parseJsonField = (field) => {
  if (!field) return null
  if (Array.isArray(field)) return field
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch (e) {
      console.warn('Ошибка парсинга JSON поля:', e)
      return null
    }
  }
  return field
}

// Функция для обработки проекта - парсинг JSON полей
const processProject = (project) => {
  if (!project) return project
  
  // Парсим images
  if (project.images) {
    project.images = parseJsonField(project.images) || []
  }
  
  // Парсим features
  if (project.features) {
    project.features = parseJsonField(project.features) || []
  }
  
  return project
}

export const api = {
  /**
   * Получить все проекты с фильтрами
   * @param {Object} filters - Объект с фильтрами
   * @param {string} filters.district - Район
   * @param {string} filters.status - Статус проекта
   * @param {string} filters.type - Тип проекта
   * @param {number} filters.areaMin - Минимальная площадь
   * @param {number} filters.areaMax - Максимальная площадь
   * @param {number} filters.priceMin - Минимальная цена
   * @param {number} filters.priceMax - Максимальная цена
   * @returns {Promise<Array>} Массив проектов
   */
  async getProjects(filters = {}) {
    // Формируем query параметры согласно API
    const params = new URLSearchParams()
    
    if (filters.district) params.append('district', filters.district)
    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)
    if (filters.areaMin) params.append('areaMin', filters.areaMin)
    if (filters.areaMax) params.append('areaMax', filters.areaMax)
    if (filters.priceMin) params.append('priceMin', filters.priceMin)
    if (filters.priceMax) params.append('priceMax', filters.priceMax)

    const queryString = params.toString()
    const url = `${API_URL}/api/v1/projects${queryString ? `?${queryString}` : ''}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Проекты не найдены')
        }
        if (response.status >= 500) {
          throw new Error(`Ошибка сервера: ${response.status}`)
        }
        throw new Error(`Ошибка при загрузке проектов: ${response.status}`)
      }

      const projects = await response.json()
      
      // Парсим JSON поля для каждого проекта
      return projects.map(project => processProject(project))
    } catch (error) {
      // Обработка сетевых ошибок
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Ошибка сети при загрузке проектов:', error)
        throw new Error('Ошибка подключения к серверу. Проверьте подключение к интернету.')
      }
      console.error('Ошибка при загрузке проектов:', error)
      throw error
    }
  },

  /**
   * Получить проект по ID
   * @param {number|string} id - ID проекта
   * @returns {Promise<Object>} Объект проекта
   */
  async getProjectById(id) {
    const url = `${API_URL}/api/v1/projects/${id}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Проект не найден')
        }
        if (response.status >= 500) {
          throw new Error(`Ошибка сервера: ${response.status}`)
        }
        throw new Error(`Ошибка при загрузке проекта: ${response.status}`)
      }

      const project = await response.json()
      
      // Парсим JSON поля
      return processProject(project)
    } catch (error) {
      // Обработка сетевых ошибок
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Ошибка сети при загрузке проекта:', error)
        throw new Error('Ошибка подключения к серверу. Проверьте подключение к интернету.')
      }
      console.error('Ошибка при загрузке проекта:', error)
      throw error
    }
  },

  /**
   * Отправить форму обратного звонка
   * @param {Object} data - Данные формы
   * @param {string} data.name - Имя
   * @param {string} data.phone - Телефон
   * @param {string} data.reason - Причина обращения
   * @param {number|string} data.projectId - ID проекта (опционально)
   * @param {number|string} data.house_id - ID дома (опционально)
   * @param {string} data.notes - Дополнительные заметки (опционально)
   * @returns {Promise<Object>} Ответ сервера
   */
  async submitCallback(data) {
    const url = `${API_URL}/api/v1/callbacks`

    try {
      const requestBody = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        reason: data.reason,
      }

      // Добавляем project_id, если он передан (бэкенд ожидает project_id, а не projectId)
      if (data.projectId) {
        requestBody.project_id = data.projectId
      }

      // Добавляем house_id, если он передан
      if (data.house_id) {
        requestBody.house_id = data.house_id
      }

      // Добавляем notes, если они переданы
      if (data.notes) {
        requestBody.notes = data.notes
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Ошибка при отправке формы')
        }
        if (response.status >= 500) {
          throw new Error(`Ошибка сервера: ${response.status}`)
        }
        throw new Error(`Ошибка при отправке формы: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      // Обработка сетевых ошибок
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Ошибка сети при отправке формы:', error)
        throw new Error('Ошибка подключения к серверу. Проверьте подключение к интернету.')
      }
      console.error('Ошибка при отправке формы:', error)
      throw error
    }
  },
}

