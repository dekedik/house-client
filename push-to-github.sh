#!/bin/bash

echo "========================================"
echo "Отправка клиентского приложения в GitHub"
echo "========================================"
echo ""

# Проверка Git
if ! command -v git &> /dev/null; then
    echo "ОШИБКА: Git не установлен!"
    echo "Пожалуйста, установите Git"
    exit 1
fi

echo "Git найден!"
echo ""

# Инициализация git репозитория
echo "Инициализация git репозитория..."
git init

# Добавление remote репозитория
echo ""
echo "Добавление remote репозитория..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/dekedik/house-client.git

# Добавление файлов
echo ""
echo "Добавление файлов..."
git add .

# Создание коммита
echo ""
echo "Создание коммита..."
git commit -m "Initial commit: React клиентское приложение для агентства новостроек"

# Установка ветки main
echo ""
echo "Установка ветки main..."
git branch -M main

# Отправка в репозиторий
echo ""
echo "Отправка в репозиторий..."
echo "ВНИМАНИЕ: Вам потребуется ввести логин и пароль (или токен) GitHub"
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "УСПЕШНО! Код отправлен в репозиторий!"
    echo "========================================"
else
    echo ""
    echo "Ошибка при отправке. Убедитесь, что у вас есть доступ к репозиторию."
    exit 1
fi

