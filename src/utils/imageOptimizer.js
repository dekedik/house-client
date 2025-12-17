/**
 * Утилита для оптимизации URL изображений
 * Добавляет параметры для уменьшения размера изображений
 */

/**
 * Оптимизирует URL изображения, добавляя параметры для уменьшения размера
 * @param {string} imageUrl - Исходный URL изображения
 * @param {Object} options - Опции оптимизации
 * @param {number} options.width - Ширина изображения
 * @param {number} options.height - Высота изображения
 * @param {number} options.quality - Качество (1-100, по умолчанию 80)
 * @returns {string} Оптимизированный URL
 */
export const optimizeImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return imageUrl
  
  const { width, height, quality = 80 } = options
  
  // Если это Unsplash изображение, добавляем параметры оптимизации
  if (imageUrl.includes('unsplash.com')) {
    const url = new URL(imageUrl)
    if (width) url.searchParams.set('w', width.toString())
    if (height) url.searchParams.set('h', height.toString())
    url.searchParams.set('q', quality.toString())
    url.searchParams.set('fit', 'crop')
    url.searchParams.set('auto', 'format')
    return url.toString()
  }
  
  // Для других источников возвращаем как есть
  // В будущем можно добавить поддержку других CDN
  return imageUrl
}

/**
 * Получает оптимальный размер изображения для разных устройств
 * @param {string} type - Тип изображения ('hero', 'card', 'thumbnail', 'logo')
 * @returns {Object} Объект с width и height
 */
export const getOptimalImageSize = (type) => {
  const sizes = {
    hero: { width: 1920, height: 1080 },
    card: { width: 512, height: 320 },
    cardMobile: { width: 400, height: 192 },
    thumbnail: { width: 200, height: 96 },
    detail: { width: 800, height: 384 },
    logo: { width: 40, height: 40 },
  }
  
  return sizes[type] || sizes.card
}

