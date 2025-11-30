@echo off
echo ========================================
echo Отправка клиентского приложения в GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Проверка Git...
git --version
if %errorlevel% neq 0 (
    echo.
    echo ОШИБКА: Git не установлен или не найден в PATH!
    echo Пожалуйста, установите Git с https://git-scm.com/download/win
    echo После установки перезапустите этот скрипт.
    pause
    exit /b 1
)

echo.
echo Git найден!
echo.

echo Инициализация git репозитория...
git init
if %errorlevel% neq 0 (
    echo Ошибка при инициализации git
    pause
    exit /b 1
)

echo.
echo Добавление remote репозитория...
git remote remove origin 2>nul
git remote add origin https://github.com/dekedik/house-client.git
if %errorlevel% neq 0 (
    echo Ошибка при добавлении remote
    pause
    exit /b 1
)

echo.
echo Добавление файлов...
git add .
if %errorlevel% neq 0 (
    echo Ошибка при добавлении файлов
    pause
    exit /b 1
)

echo.
echo Создание коммита...
git commit -m "Initial commit: React клиентское приложение для агентства новостроек"
if %errorlevel% neq 0 (
    echo Ошибка при создании коммита
    pause
    exit /b 1
)

echo.
echo Установка ветки main...
git branch -M main
if %errorlevel% neq 0 (
    echo Ошибка при установке ветки
    pause
    exit /b 1
)

echo.
echo Отправка в репозиторий...
echo ВНИМАНИЕ: Вам потребуется ввести логин и пароль (или токен) GitHub
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo Ошибка при отправке. Возможно требуется аутентификация.
    echo Убедитесь, что у вас есть доступ к репозиторию https://github.com/dekedik/house-client.git
    pause
    exit /b 1
)

echo.
echo ========================================
echo УСПЕШНО! Код отправлен в репозиторий!
echo ========================================
pause



