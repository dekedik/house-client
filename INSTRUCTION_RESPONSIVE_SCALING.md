# Инструкция: Масштабирование текста и изображений на сайте

## Обзор

Сайт использует **Tailwind CSS** с адаптивным дизайном (responsive design) для автоматического масштабирования текста и изображений в зависимости от размера экрана устройства.

## 1. Система Breakpoints (Точки перелома)

Tailwind CSS использует следующие breakpoints по умолчанию:

```javascript
sm:  640px   // Маленькие планшеты (портретная ориентация)
md:  768px   // Планшеты и маленькие ноутбуки
lg:  1024px  // Ноутбуки и десктопы
xl:  1280px  // Большие десктопы
2xl: 1536px  // Очень большие экраны
```

**Принцип работы**: Стили применяются **от меньшего к большему**. Например:
- `text-xl` - базовый размер (мобильные устройства)
- `md:text-2xl` - размер для экранов от 768px и больше

## 2. Масштабирование текста

### 2.1. Адаптивные размеры текста

Используется синтаксис: `[базовый-размер] [breakpoint]:[размер-на-breakpoint]`

#### Примеры из проекта:

```jsx
// Заголовок Hero секции
<h1 className="text-4xl sm:text-5xl font-bold">
  // Мобильные: text-4xl (2.25rem / 36px)
  // От 640px: text-5xl (3rem / 48px)
</h1>

// Заголовок карточки проекта
<h3 className="text-xl md:text-2xl font-bold">
  // Мобильные: text-xl (1.25rem / 20px)
  // От 768px: text-2xl (1.5rem / 24px)
</h3>

// Обычный текст
<p className="text-lg sm:text-xl">
  // Мобильные: text-lg (1.125rem / 18px)
  // От 640px: text-xl (1.25rem / 20px)
</p>

// Мелкий текст
<span className="text-xs sm:text-sm">
  // Мобильные: text-xs (0.75rem / 12px)
  // От 640px: text-sm (0.875rem / 14px)
</span>
```

### 2.2. Шкала размеров текста в Tailwind

| Класс | Размер (rem) | Размер (px) | Использование |
|-------|--------------|-------------|---------------|
| `text-xs` | 0.75rem | 12px | Мелкие метки, подсказки |
| `text-sm` | 0.875rem | 14px | Вторичный текст |
| `text-base` | 1rem | 16px | Основной текст (по умолчанию) |
| `text-lg` | 1.125rem | 18px | Увеличенный текст |
| `text-xl` | 1.25rem | 20px | Подзаголовки |
| `text-2xl` | 1.5rem | 24px | Заголовки секций |
| `text-3xl` | 1.875rem | 30px | Большие заголовки |
| `text-4xl` | 2.25rem | 36px | Hero заголовки (мобильные) |
| `text-5xl` | 3rem | 48px | Hero заголовки (десктоп) |

### 2.3. Примеры из реальных компонентов

#### Header.jsx
```jsx
// Логотип и название
<span className="text-xl font-bold">Новостройки</span>
// Всегда text-xl, не масштабируется

// Мобильное меню
<Link className="text-2xl font-semibold">Дома</Link>
// Крупный текст для удобства на мобильных
```

#### HomePage.jsx
```jsx
// Hero заголовок
<h1 className="text-4xl sm:text-5xl font-bold">
  // Мобильные: 36px
  // Планшеты+: 48px
</h1>

// Hero описание
<p className="text-lg sm:text-xl mb-8">
  // Мобильные: 18px
  // Планшеты+: 20px
</p>
```

#### ProjectCard.jsx
```jsx
// Название проекта
<h3 className="text-xl md:text-2xl font-bold">
  // Мобильные: 20px
  // Десктоп: 24px
</h3>

// Описание
<p className="text-gray-600 text-base mb-3">
  // Всегда 16px (базовый размер)
</p>

// Цена
<p className="text-xl font-bold text-primary-600">
  // Всегда 20px
</p>
```

#### MortgageCalculator.jsx (самый сложный пример)
```jsx
// Заголовок модального окна
<h2 className="text-base sm:text-xl md:text-2xl font-bold">
  // Мобильные: 16px
  // Планшеты: 20px
  // Десктоп: 24px
</h2>

// Результаты расчета
<p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-bold">
  // Мобильные: 12px
  // Планшеты: 18px
  // Ноутбуки: 20px
  // Десктоп: 24px
</p>
```

## 3. Масштабирование изображений

### 3.1. Основные подходы

#### A. Фиксированная высота на мобильных, адаптивная на десктопе

```jsx
// ProjectCard.jsx - изображения в карточках
<div className="md:hidden" style={{ height: '192px' }}>
  <img 
    src={image}
    style={{ width: '100%', height: '192px', objectFit: 'cover' }}
  />
</div>

<div className="hidden md:block">
  <img 
    src={image}
    className="w-full h-full"
    style={{ objectFit: 'cover' }}
  />
</div>
```

**Принцип**:
- Мобильные: фиксированная высота 192px, ширина 100%
- Десктоп: адаптивная высота (занимает доступное пространство)

#### B. Адаптивная высота с object-fit

```jsx
// ProjectDetailPage.jsx - главное изображение
<div className="relative h-96 rounded-xl overflow-hidden">
  <img
    src={image}
    className="w-full h-full object-cover"
  />
</div>
```

**Принцип**:
- `h-96` = 384px высота (24rem)
- `w-full` = 100% ширины контейнера
- `object-cover` = изображение заполняет контейнер, сохраняя пропорции

#### C. Логотипы и иконки

```jsx
// Header.jsx - логотип
<img 
  src="/logo.jpg" 
  className="h-10 w-10 rounded-lg object-cover"
/>
```

**Принцип**:
- Фиксированный размер: 40px × 40px (h-10 w-10)
- `object-cover` для правильного отображения

### 3.2. Grid системы для изображений

```jsx
// ProjectDetailPage.jsx - миниатюры
<div className="grid grid-cols-3 gap-4">
  {images.map((image, index) => (
    <button className="h-24 rounded-lg overflow-hidden">
      <img src={image} className="w-full h-full object-cover" />
    </button>
  ))}
</div>
```

**Принцип**:
- `grid-cols-3` = 3 колонки на всех устройствах
- `h-24` = фиксированная высота 96px
- `gap-4` = отступы между изображениями

### 3.3. Background изображения

```jsx
// HomePage.jsx - Hero секция
<div 
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(...)'
  }}
>
</div>
```

**Принцип**:
- `bg-cover` = изображение покрывает весь контейнер
- `bg-center` = центрирование
- `bg-no-repeat` = без повторения

## 4. Адаптивные контейнеры и отступы

### 4.1. Контейнеры

```jsx
// Стандартный контейнер
<div className="container mx-auto px-4">
  // container = max-width с отступами
  // mx-auto = центрирование
  // px-4 = горизонтальные отступы 16px
</div>

// С адаптивными отступами
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  // Мобильные: 16px
  // Планшеты: 24px
  // Десктоп: 32px
</div>
```

### 4.2. Отступы (Padding/Margin)

```jsx
// Адаптивные вертикальные отступы
<section className="py-12 md:py-16 lg:py-20">
  // Мобильные: 48px сверху/снизу
  // Десктоп: 64px
  // Большие экраны: 80px
</section>

// Адаптивные горизонтальные отступы
<div className="px-4 md:px-6 lg:px-8">
  // Мобильные: 16px
  // Планшеты: 24px
  // Десктоп: 32px
</div>
```

## 5. Адаптивные Grid и Flexbox

### 5.1. Grid системы

```jsx
// Адаптивное количество колонок
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  // Мобильные: 1 колонка
  // Планшеты: 2 колонки
  // Десктоп: 3 колонки
</div>

// ProjectCard.jsx - характеристики
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  // Мобильные: 2 колонки
  // Десктоп: 4 колонки
</div>
```

### 5.2. Flexbox направления

```jsx
// ProjectCard.jsx - основной контейнер
<div className="flex flex-col md:flex-row md:items-stretch">
  // Мобильные: вертикальное расположение (flex-col)
  // Десктоп: горизонтальное (flex-row)
</div>

// Изменение порядка элементов
<div className="order-1 md:order-2">
  // Мобильные: первый элемент
  // Десктоп: второй элемент
</div>
```

## 6. Скрытие/показ элементов

```jsx
// Показать только на мобильных
<div className="md:hidden">
  Мобильная версия
</div>

// Показать только на десктопе
<div className="hidden md:block">
  Десктопная версия
</div>

// Показать на планшетах и больше
<div className="hidden sm:block">
  Планшеты и десктоп
</div>
```

## 7. Практические примеры

### Пример 1: Адаптивный заголовок

```jsx
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  Заголовок
</h1>
// Мобильные: 30px
// Планшеты: 36px
// Десктоп: 48px
```

### Пример 2: Адаптивное изображение

```jsx
<div className="w-full">
  <img 
    src="image.jpg"
    className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
  />
</div>
// Мобильные: высота 256px
// Планшеты: высота 384px
// Десктоп: высота 500px
```

### Пример 3: Адаптивная карточка

```jsx
<div className="flex flex-col md:flex-row gap-4 p-4 md:p-6">
  <div className="w-full md:w-1/3">
    <img className="w-full h-48 md:h-full object-cover" />
  </div>
  <div className="w-full md:w-2/3">
    <h3 className="text-xl md:text-2xl">Заголовок</h3>
    <p className="text-base md:text-lg">Описание</p>
  </div>
</div>
```

## 8. Ключевые классы для изображений

| Класс | Описание |
|-------|----------|
| `w-full` | Ширина 100% |
| `h-full` | Высота 100% |
| `object-cover` | Заполняет контейнер, сохраняя пропорции (обрезает) |
| `object-contain` | Вписывается в контейнер полностью (может быть пустое пространство) |
| `object-center` | Центрирование изображения |
| `rounded-lg` | Скругленные углы |

## 9. Best Practices

### ✅ Правильно

```jsx
// Используйте адаптивные размеры текста
<h1 className="text-3xl md:text-4xl lg:text-5xl">

// Используйте object-cover для изображений
<img className="w-full h-64 object-cover" />

// Используйте адаптивные отступы
<div className="px-4 md:px-6 lg:px-8">
```

### ❌ Неправильно

```jsx
// Фиксированные размеры без адаптивности
<h1 className="text-5xl">  // Слишком большой на мобильных

// Изображения без object-fit
<img className="w-full h-64" />  // Может исказиться

// Фиксированные отступы
<div className="px-8">  // Слишком много на мобильных
```

## 10. Тестирование

Для проверки адаптивности:

1. **Chrome DevTools**: F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. **Размеры для тестирования**:
   - Mobile: 375px, 414px
   - Tablet: 768px, 1024px
   - Desktop: 1280px, 1920px

3. **Проверьте**:
   - Читаемость текста на всех размерах
   - Корректное отображение изображений
   - Удобство навигации на мобильных
   - Правильное расположение элементов

## 11. Резюме

**Текст**:
- Используйте адаптивные классы: `text-base md:text-lg`
- Начинайте с мобильного размера, увеличивайте для больших экранов
- Используйте семантические размеры (h1 больше h2)

**Изображения**:
- Используйте `object-cover` для заполнения контейнера
- Фиксируйте высоту на мобильных, делайте адаптивной на десктопе
- Используйте `w-full` для адаптивной ширины

**Контейнеры**:
- Используйте `container mx-auto` для центрирования
- Адаптивные отступы: `px-4 md:px-6 lg:px-8`
- Адаптивные Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

**Примечание**: Все примеры основаны на текущей реализации проекта. При изменении дизайна обновите соответствующие классы.


