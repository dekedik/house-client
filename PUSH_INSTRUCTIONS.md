# Инструкции по отправке в репозиторий

Если Git установлен, выполните следующие команды в папке `client`:

```bash
cd client

# Инициализация git (если еще не инициализирован)
git init

# Добавление remote репозитория
git remote add origin https://github.com/dekedik/house-client.git

# Добавление всех файлов
git add .

# Создание коммита
git commit -m "Initial commit: React клиентское приложение для агентства новостроек"

# Отправка в репозиторий
git branch -M main
git push -u origin main
```

Если репозиторий уже существует и содержит файлы, может потребоваться:

```bash
git pull origin main --allow-unrelated-histories
```

Затем снова:

```bash
git add .
git commit -m "Initial commit: React клиентское приложение для агентства новостроек"
git push -u origin main
```

