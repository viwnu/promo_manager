Prompt 1 — Инвентаризация swagger/Api.ts + карта эндпоинтов
Ты в Vite + React + TS проекте.
Есть ./swagger.json и сгенерированный клиент ./src/api/Api.ts.

Важное:

- Base URL API: http://localhost:3000/api
- accessToken хранится в httpOnly cookie. Фронт не хранит токены и не подставляет Authorization.
- Все запросы должны идти с credentials: 'include'.
- Роли/права валидируются сервером.

Задача:

1. Проанализируй swagger.json и Api.ts.
2. Составь список эндпоинтов: auth (login/register/logout/me/refresh), users, promocodes, orders, apply promocode, analytics (users/promocodes/usages).
3. Для analytics определи, какие query params ожидаются (date range, pagination, sorting, filtering).
4. Предложи краткую структуру папок и роутов SPA.

Пока НЕ пиши код.

```
Ниже результат анализа swagger.json и сгенерированного клиента Api.ts. Код не пишу, как просили.

Эндпоинты

Auth:

POST /api/auth/login — login (body: CreateUserIdentityModel)
POST /api/auth/refresh — refresh (body: RefreshToken)
PATCH /api/auth — logout
POST /api/users/signup — register (signup)
GET /api/users/me — me
Users:

GET /api/users — список
PATCH /api/users — update (body: UpdateUserDto)
PATCH /api/users/ban — ban (query: email)
GET /api/users/me — профиль (дублирую как часть auth/me)
Promo codes:

POST /api/promo-codes — create (body: CreatePromoCodeDto)
GET /api/promo-codes — список
GET /api/promo-codes/{id} — детали
PATCH /api/promo-codes/{id} — update (body: UpdatePromoCodeDto)
PATCH /api/promo-codes/disable/{id} — disable
Orders:

GET /api/orders/my — мои заказы
Apply promo code:

POST /api/orders/apply-promo-code — применить промокод (query: orderId, code)
Analytics:

GET /api/analytics/users
GET /api/analytics/promo-codes
GET /api/analytics/promo-code-usage
Analytics: query params

Общие для всех трех:

datePreset: today | last7Days | last30Days | custom
from: date (string)
to: date (string)
limit: number
offset: number
sortBy: string
sortDir: asc | desc
Фильтры для /api/analytics/users:

userId, email, name, phone, search (search по email/name/phone)
Фильтры для /api/analytics/promo-codes:

promoCodeId, code, search (search по code)
Фильтры для /api/analytics/promo-code-usage:

promoCodeId, code, userId, orderId, email, name, phone, search (search по code/email/name/phone)
Краткая структура папок и роутов SPA

Папки:

src/app — bootstrap, providers, router
src/pages — страницы
src/features — доменные фичи (auth, users, promoCodes, orders, analytics)
src/entities — модели/типы домена (User, PromoCode, Order, Analytics)
src/shared — ui, lib, api, hooks, constants
Роуты (пример):

/login
/register
/ или /dashboard
/users
/promo-codes
/promo-codes/:id
/orders
/analytics/users
/analytics/promo-codes
/analytics/usage
```

Зафиксируй контракты:

- Создай файл docs/api-contracts.md и выпиши точные сигнатуры методов из src/api/Api.ts, которые ты будешь использовать (auth/users/promocodes/orders/analytics).
- Для каждого метода укажи: имя метода, путь, типы request/response, query params.
  Никакого кода приложения не меняй, только docs/api-contracts.md.

Prompt 2 (обновлённый) — зависимости + каркас приложения + роутинг
Сделай базовый каркас SPA.

Контракты (из docs/api-contracts.md) уже зафиксированы.

1) Установи зависимости:
- react-router-dom
- @tanstack/react-query
- react-hook-form
- zod
- @hookform/resolvers
- dayjs
- notistack

2) Создай .env.example:
VITE_API_BASE_URL=http://localhost:3000

ВАЖНО: в Api.ts пути уже начинаются с /api/... поэтому baseUrl должен быть http://localhost:3000 (без /api).

3) Создай инфраструктуру:
- src/app/providers/AppProviders.tsx:
  - QueryClientProvider (с дефолтными опциями)
  - SnackbarProvider
  - MUI ThemeProvider + CssBaseline
- src/app/layouts/AppLayout.tsx:
  - простой AppBar/Drawer (можно временно placeholder)
  - <Outlet/>
- src/app/router/router.tsx:
  - маршруты:
    /login
    /register
    /users
    /promo-codes
    /orders
    /analytics/users
    /analytics/promo-codes
    /analytics/usage
  - ProtectedRoute: защищает всё кроме login/register

4) src/main.tsx подключи:
<AppProviders><RouterProvider router={router} /></AppProviders>

На этом шаге auth можно заглушить (ProtectedRoute временно всегда пускает), но структура должна компилироваться.

Prompt 3 (обновлённый) — apiClient: baseUrl + credentials include + 401
Реализуй единый API client поверх сгенерированного src/api/Api.ts.

Требования:
1) Создай src/api/apiClient.ts:
- экспортируй singleton `api` = new Api({ baseUrl: import.meta.env.VITE_API_BASE_URL })
- настрой, чтобы ВСЕ запросы отправлялись с credentials: 'include'

Найди в Api.ts механизм настройки fetch (часто есть `customFetch` или `securityWorker`/`baseApiParams`).
Если прямого способа нет — реализуй кастомный fetch, который проксируется в window.fetch, но добавляет { credentials: 'include' }.

2) Добавь src/api/httpError.ts:
- утилита isUnauthorized(e) (учитывай формат ошибок swagger-typescript-api: может кидать Error с status или возвращать response)
- нормализатор error message (для toast)

3) Глобальная обработка 401:
- пока просто экспортируй callback `onUnauthorized` (set function) из src/api/apiClient.ts
- в кастомном fetch, если response.status === 401, вызывай onUnauthorized()

НЕ храни токены, НЕ добавляй Authorization header.

Prompt 4 (обновлённый) — AuthContext по /api/users/me + login/logout/register
Сделай auth модуль под cookie-auth.

Контракты:
- authControllerLogin( CreateUserIdentityModel ) -> RefreshToken
- authControllerLogout() -> void
- usersControllerSignup( CreateUserDto ) -> void
- usersControllerFindOne() GET /api/users/me -> UserSelfView

ВАЖНО:
- accessToken в httpOnly cookie (ставится сервером)
- refreshToken возвращается в ответе login, но фронт не обязан им управлять (не сохраняй).
- Проверка авторизации: успешный usersControllerFindOne().

Сделай:
1) src/features/auth/api.ts:
- login(payload): вызвать api.authControllerLogin(payload)
- logout(): вызвать api.authControllerLogout()
- register(payload): вызвать api.usersControllerSignup(payload)
- me(): вызвать api.usersControllerFindOne()

2) src/features/auth/AuthContext.tsx:
- state: user: UserSelfView | null, isLoading boolean
- computed: isAuthenticated = !!user
- методы: refreshUser(), logout()
- при маунте провайдера вызывай refreshUser()

3) src/features/auth/useAuth.ts: хук для доступа к контексту.

4) Интегрируй глобальный 401:
- в AppProviders (или в AuthProvider) назначь apiClient.onUnauthorized = () => { setUser(null); navigate('/login'); }
(если navigate недоступен, сделай через router navigate или window.location)

5) Страницы:
- LoginPage: форма email+password (типы из CreateUserIdentityModel), submit -> login -> refreshUser -> navigate('/analytics/users')
- RegisterPage: email+password+name+phone (CreateUserDto), submit -> register -> затем login (или редирект на login; выбери самое быстрое)
Валидация: zod + react-hook-form. Ошибки показывай notistack.

6) Подключи ProtectedRoute:
- если isLoading -> loader
- если !isAuthenticated -> /login

Prompt 5 (обновлённый) — Shared: Page/Confirm/DateRange + URL params под analytics
Добавь shared UI + date range синхронизацию с URL.

1) src/shared/ui/Page.tsx:
- title (string)
- actions (ReactNode)
- children
Сделай аккуратную разметку через MUI Container/Stack.

2) src/shared/ui/ConfirmDialog.tsx: стандартный MUI Dialog с loading.

3) Date range:
- src/shared/types/dateRange.ts: тип DatePreset = 'today'|'last7Days'|'last30Days'|'custom', и DateRange { preset, from?: string, to?: string }
- src/shared/lib/dateRange.ts:
  - getPresetRange(preset): возвращает {from,to} как YYYY-MM-DD (from inclusive, to inclusive)
  - ensureRange(range): если preset != custom, подставляет from/to; если custom и не задано — дефолт last7Days

4) src/shared/hooks/useDateRangeSearchParams.ts:
- читает preset/from/to из URLSearchParams
- возвращает { range, setRange }
- setRange обновляет URL (replace: true)
- дефолт preset = last7Days

5) src/shared/ui/DateRangeFilter.tsx:
- ToggleButtonGroup для пресетов
- если custom — два поля type="date"
- onChange(range)

ПОМНИ: analytics endpoints принимают datePreset + from + to.

Prompt 6 (обновлённый) — MRT server-side state + маппинг в analytics query params (limit/offset/sortBy/sortDir/search + field filters)
Сделай инфраструктуру для server-side таблиц под ClickHouse analytics.

Контракты query params:
- datePreset, from, to
- limit, offset
- sortBy, sortDir ('asc'|'desc')
- search (строка)
и дополнительные фильтры зависят от эндпоинта.

Сделай:
1) src/shared/hooks/useMrtState.ts:
- pagination: { pageIndex, pageSize }
- sorting: MRT SortingState
- columnFilters: MRT ColumnFiltersState
- globalFilter: string
- debouncedGlobalFilter (useDebounce 300-400ms)

2) src/shared/lib/analyticsQuery.ts:
- buildAnalyticsQueryBase({dateRange, tableState}):
  - datePreset = range.preset
  - from/to = range.from/range.to (YYYY-MM-DD)
  - limit = pageSize
  - offset = pageIndex * pageSize
  - если sorting[0] есть -> sortBy=sorting[0].id, sortDir = sorting[0].desc ? 'desc' : 'asc'
  - search = debouncedGlobalFilter || undefined
- buildAnalyticsFiltersFromColumnFilters(columnFilters):
  - превращай columnFilters в { [id]: value } но только если value не пустой
  - value всегда строка (приводи)
3) Сделай так, чтобы на странице можно было легко сделать:
const query = { ...buildBase(...), ...buildFilters(...) }

Важно: promoCodeUsage имеет много фильтров — поддержи их через columnFilters.

Prompt 7 (обновлённый) — Users (CRUD “облегчённый” под текущие контракты)

У вас нет create user endpoint (кроме signup), зато есть findAll, update, ban. Значит делаем:

список пользователей

редактирование (update)

бан по email

Реализуй Users модуль по реальным контрактам.

Контракты:
- usersControllerFindAll() -> UserViewAllDTO[]
- usersControllerUpdate(UpdateUserDto) -> void
- usersControllerBan({ email }) query -> void

Сделай:
1) src/features/users/api.ts:
- listUsers(): usersControllerFindAll
- updateUser(dto: UpdateUserDto): usersControllerUpdate
- banUserByEmail(email: string): usersControllerBan({ email })

2) UsersPage:
- таблица MRT (можно client-side, т.к. API отдаёт массив без пагинации; но MRT используем для UI)
- колонки: email, name, phone, active (если есть в UserViewAllDTO), id
- действия:
  - Edit -> UserFormDialog -> update
  - Ban -> ConfirmDialog -> banUserByEmail(email)

3) UserFormDialog:
- поля, которые реально есть в UpdateUserDto (посмотри тип в Api.ts и отрисуй только их)
- react-hook-form + zod

4) React Query:
- useQuery(['users'], listUsers)
- useMutation(update/ban) с invalidation ['users']

Prompt 8 (обновлённый) — PromoCodes CRUD (как в контрактах)
Реализуй Promo Codes модуль по контрактам.

Контракты:
- promoCodesControllerFindAll() -> PromoCodeViewDto[]
- promoCodesControllerCreate(CreatePromoCodeDto) -> PromoCodeViewDto
- promoCodesControllerUpdate(id, UpdatePromoCodeDto) -> PromoCodeViewDto
- promoCodesControllerDisable(id) -> PromoCodeViewDto

Сделай:
1) src/features/promoCodes/api.ts: list/create/update/disable

2) PromoCodesPage:
- MRT таблица (client-side ок)
- колонки: code, discountPercent, totalLimit, perUserLimit, active, startAt, endAt (если есть)
- actions: Create, Edit, Disable (ConfirmDialog)

3) PromoCodeFormDialog:
- поля как в CreatePromoCodeDto/UpdatePromoCodeDto (сверь типы)
- code uppercase
- validation zod:
  - discountPercent 1..100
  - лимиты >= 0
  - даты optional, start <= end

4) React Query invalidation ['promoCodes']

Prompt 9 (обновлённый) — Orders: только “мои” + Apply promo via query params

У вас нет create order на фронте по API, только GET /orders/my и apply. Значит:

показываем мои заказы

применяем промокод к существующему orderId

Реализуй Orders модуль строго по контрактам.

Контракты:
- ordersControllerFindMyOrders() -> OrderViewDto[]
- ordersControllerApplyPromoCode({ orderId, code }) query -> PromoCodeUsageViewDto

Сделай:
1) src/features/orders/api.ts:
- listMyOrders()
- applyPromoCode(orderId: string, code: string)

2) OrdersPage:
- таблица заказов (OrderViewDto): покажи id, amount, createdAt, promoCode (если есть), discountAmount (если есть)
- action "Apply promo" на строке:
  - диалог ApplyPromoDialog (одно поле code)
  - submit -> applyPromoCode(orderId, code)
  - toast success/error
- после успеха refetch orders + invalidate analytics queries

3) Учти, что apply endpoint принимает query params (orderId, code).

Prompt 10–11 (обновлённые) — Analytics pages с server-side (ClickHouse)

Тут важно: ответы DTO скорее всего содержат items + total (или аналог). Codex должен посмотреть типы Analytics*ViewDto.

Prompt 10 — Analytics Users
Реализуй analytics страницу пользователей: /analytics/users.

Контракт:
analyticsControllerGetUsersAggregatedStats(query) -> AnalyticsUsersAggregatedStatsViewDto
Query params:
datePreset, from, to, limit, offset, sortBy, sortDir,
и фильтры: userId, email, name, phone, search

Сделай:
1) src/features/analytics/api.ts:
- getUsersStats(params) вызывает analyticsControllerGetUsersAggregatedStats(params)

2) src/features/analytics/pages/AnalyticsUsersPage.tsx:
- useDateRangeSearchParams для range
- DateRangeFilter сверху
- MRT в manual режиме: pagination/sorting/columnFilters/globalFilter
- globalFilter -> search
- columnFilters маппятся в userId/email/name/phone (разреши только эти поля)
- запрос:
  const base = buildAnalyticsQueryBase(...)
  const filters = buildAnalyticsFiltersFromColumnFilters(...)
  api.getUsersStats({ ...base, ...filters })
- распарси ответ:
  - если DTO содержит items/rows + total — используй для rowCount
  - если структура другая — подстройся по типу из Api.ts

3) React Query:
- queryKey включает range + pagination + sorting + columnFilters + debounced globalFilter
- keepPreviousData true

4) По умолчанию preset last7Days.

Prompt 11 — Analytics PromoCodes + Usage
Добавь страницы:
- /analytics/promo-codes (analyticsControllerGetPromoCodesAggregatedStats)
- /analytics/usage (analyticsControllerGetPromoCodeUsageHistory)

Query params для promo-codes:
datePreset/from/to/limit/offset/sortBy/sortDir + promoCodeId + code + search

Query params для usage:
datePreset/from/to/limit/offset/sortBy/sortDir + promoCodeId + code + userId + orderId + email + name + phone + search

Сделай:
1) В analytics/api.ts добавь методы:
- getPromoCodesStats
- getPromoCodeUsageHistory

2) Страницы:
AnalyticsPromoCodesPage:
- DateRangeFilter
- MRT manual
- columnFilters -> promoCodeId, code
- globalFilter -> search

AnalyticsUsagePage:
- DateRangeFilter
- MRT manual
- columnFilters -> promoCodeId, code, userId, orderId, email, name, phone
- globalFilter -> search

3) Убедись что limit/offset/sortBy/sortDir прокидываются корректно.
4) Обработай rowCount из ответа (по типу DTO).

Prompt 12 (обновлённый) — Navbar + logout + 401 redirect + README
Сделай финальную полировку.

1) AppLayout:
- меню ссылок: Users, Promo Codes, Orders, Analytics Users, Analytics Promo Codes, Analytics Usage
- кнопка Logout:
  - вызывает auth.logout() (api.authControllerLogout)
  - затем refreshUser() или сразу setUser(null)
  - navigate('/login')

2) Убедись что глобальная обработка 401 работает:
- при 401 user становится null
- редирект на /login

3) Добавь страницу 404.

4) README.md:
- VITE_API_BASE_URL=http://localhost:3000 (важно: без /api)
- почему credentials include
- список страниц
- как запустить

Важная корректировка (чтобы не словить баг на baseUrl)

У вас в swagger путях уже есть /api/..., а baseUrl вы сказали http://localhost:3000/api.
Если сделать так, получится http://localhost:3000/api/api/....

Поэтому в промптах я зафиксировал:
✅ VITE_API_BASE_URL=http://localhost:3000 (без /api)

Если у вас сгенерированный Api.ts устроен иначе (например, пути без /api), тогда наоборот. Но по контрактам видно, что пути именно /api/....