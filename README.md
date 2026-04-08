# 🚀 ProPlanner AI - Система за управление на AI инструменти

ProPlanner AI е модерна, двуезична уеб платформа за организиране, филтриране и управление на екипни AI ресурси. Проектът е изграден с разделена (headless) архитектура, включваща сигурен API бекенд и бърз, интерактивен фронтенд.

## ✨ Ключови функционалности
* **Двуезичен интерфейс (i18n):** Пълна поддръжка на Български и Английски език със запаметяване на предпочитанията.
* **Ролеви модел (RBAC):** Интегрирана система за роли и права (Owner, Frontend, Backend, QA, Designer и др.) чрез `spatie/laravel-permission`.
* **Защита с 2FA:** Двуфакторна автентикация при вход чрез изпращане на код по имейл.
* **Админ Панел (Admin Hub):** Специализиран модул за одобряване на чакащи задачи и нови потребители от администраторите.
* **Модерно търсене и филтриране:** Филтриране на ресурси по име, категория и роля в реално време.

## 🛠 Използвани технологии

### Frontend
* **Рамка:** Next.js (App Router)
* **Стайлинг:** Tailwind CSS
* **Икони:** Lucide React
* **HTTP Клиент:** Axios
* **Нотификации:** React Hot Toast

### Backend
* **Рамка:** Laravel 11
* **База данни:** MySQL (чрез Docker / Laravel Sail)
* **Автентикация:** Laravel Sanctum (Stateful SPA Authentication)
* **Роли и Права:** Spatie Permissions

---

## ⚙️ Инсталация и стартиране (Development)

За да стартирате проекта локално, трябва да имате инсталирани **Docker Desktop** и **Node.js**.

### 1. Подготовка на Backend-а (API)
Отворете терминал в папката `backend`:

```bash
# Копиране на конфигурационния файл
cp .env.example .env

# Инсталиране на PHP зависимостите чрез контейнер
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs

# Стартиране на Docker контейнерите
./vendor/bin/sail up -d

# Генериране на ключ за приложението
./vendor/bin/sail artisan key:generate

# Създаване на базата данни и наливане на първоначалните данни (Roles, Categories, Users)
./vendor/bin/sail artisan migrate:fresh --seed