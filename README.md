# PromoCode Manager

Попробовать запущенное приложение: [Promo Code Manager](http://5.129.242.251:3000/)
login: admin@email.com
password: my-strong-password (у всех пользователей)

Fullstack приложение для управления промокодами и аналитикой.

Стек:

- Backend: NestJS, TypeScript, Mongoose, CQRS, ClickHouse
- Frontend: React + Vite + TypeScript + MUI + material-react-table
- Базы данных: MongoDB (source of truth), ClickHouse (аналитика)
- Инфраструктура: Docker Compose

## Что реализовано

- Авторизация, аутентификация и RBAC: `libs/shared/auth`.
- Swagger-документация через `libs/shared/api-doc` доступна по `http://host:port/api/docs`.
- Логирование: `libs/shared/logger`.
- Сериализация данных: `libs/shared/serializer`.
- Feature-модули API: `apps/api/src/features`.
- CRUD/API для пользователей и промокодов, применение промокодов в модуле заказов, API аналитики.
- Сиды основной БД: `apps/api/src/db/seed`.
- Связь доменной логики и аналитики через CQRS events: `apps/api/src/events`.
- Автоинициализация таблиц ClickHouse: скрипт `ch:init`.
- Автозаполнение аналитики при старте: `apps/api/src/features/analytics/backfill.service.ts`.
- Автогенерация типов для web через `swagger-typescript-api` из `apps/web/swagger.json`.
- В production UI раздается как статический контент из `apps/web/dist` (Nest `ServeStaticModule`).
- В development UI запускается отдельно: `dev:web`, либо вместе с API: `dev` (Unix) / `dev:cmd` (Windows).
- Race conditions при применении промокодов решены транзакциями MongoDB (нужен replica set).
- Расчет скидок сделан через `decimal.js` для корректной работы с дробными числами.
- Реализован оптимистичный UI; во фронте вынесены хуки, утилиты, работа с сетью, состояние и отображение.

## Архитектурное решение (MongoDB + ClickHouse)

- MongoDB: CRUD и транзакционная доменная логика.
- ClickHouse: аналитические таблицы и быстрые агрегаты для отчетов.
- Синхронизация: события CQRS + backfill для восстановления/дозаполнения аналитики.

План развития:

- Разделение на микросервисы с брокером сообщений/очередями.
- Популярные варианты: Kafka, RabbitMQ, BullMQ.
- Практичный старт: RabbitMQ для интеграционных событий между сервисами; BullMQ для фоновых задач/ретраев внутри Node.js контуров.
- Kafka имеет смысл при высоком потоке событий и необходимости длительного event log.

## Переменные окружения

- Локально: `.env.api.development`
- Прод: `.env.api.production`
- Пример для docker-сети: `.env.api.example.docker`

Для web-приложения значения также читаются из `.env.api.*` через `apps/web/vite.config.ts`:

- `VITE_API_BASE_URL` — базовый URL фронта/клиента
- `API_BASE_URL` — backend host для Vite proxy

## Запуск в development

Установка зависимостей:

```bash
yarn install
yarn --cwd apps/web install
```

Запуск:

```bash
# API
yarn dev:api

# Web
yarn dev:web

# API + Web (Unix)
yarn dev

# API + Web (Windows)
yarn dev:cmd
```

Доступные URL в development:

- Frontend: `http://localhost:5173`
- Swagger: `http://localhost:3000/api/docs`

## Сборка

```bash
# Web
yarn build:web

# API
yarn build:api
```

## Запуск в production (Docker)

```bash
docker compose up -d --build
```

Поднимутся сервисы:

- `app` (Nest + статический web) на `http://localhost:3000`
- `mongo` (replica set `rs0`, внутренний сервис)
- `clickhouse` (внутренний сервис)

При старте `app` выполняется:

1. seed MongoDB
2. `ch:init` для ClickHouse
3. запуск API в production

Доступные URL в production:

- Frontend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

## Полезные команды

```bash
# Инициализация таблиц аналитики
yarn ch:init

# Генерация web API типов из swagger
yarn --cwd apps/web generate:api:types
```
