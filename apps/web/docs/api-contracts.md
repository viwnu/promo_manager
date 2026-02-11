# API Contracts

Источник: `src/api/Api.ts/Api.ts` (сгенерированный клиент).

**Auth**

| Метод | Путь | Request type | Response type | Query params |
| --- | --- | --- | --- | --- |
| `authControllerLogin` | `POST /api/auth/login` | `CreateUserIdentityModel` | `RefreshToken` | нет |
| `authControllerRefresh` | `POST /api/auth/refresh` | `RefreshToken` | `any` | нет |
| `authControllerLogout` | `PATCH /api/auth` | нет | `void` | нет |
| `usersControllerSignup` | `POST /api/users/signup` | `CreateUserDto` | `void` | нет |

**Users**

| Метод | Путь | Request type | Response type | Query params |
| --- | --- | --- | --- | --- |
| `usersControllerFindAll` | `GET /api/users` | нет | `UserViewAllDTO[]` | нет |
| `usersControllerUpdate` | `PATCH /api/users` | `UpdateUserDto` | `void` | нет |
| `usersControllerFindOne` | `GET /api/users/me` | нет | `UserSelfView` | нет |
| `usersControllerBan` | `PATCH /api/users/ban` | нет | `void` | `email: string` |

**Promo Codes**

| Метод | Путь | Request type | Response type | Query params |
| --- | --- | --- | --- | --- |
| `promoCodesControllerCreate` | `POST /api/promo-codes` | `CreatePromoCodeDto` | `PromoCodeViewDto` | нет |
| `promoCodesControllerFindAll` | `GET /api/promo-codes` | нет | `PromoCodeViewDto[]` | нет |
| `promoCodesControllerFindOne` | `GET /api/promo-codes/{id}` | нет | `PromoCodeViewDto` | нет (path: `id: string`) |
| `promoCodesControllerUpdate` | `PATCH /api/promo-codes/{id}` | `UpdatePromoCodeDto` | `PromoCodeViewDto` | нет (path: `id: string`) |
| `promoCodesControllerDisable` | `PATCH /api/promo-codes/disable/{id}` | нет | `PromoCodeViewDto` | нет (path: `id: string`) |

**Orders**

| Метод | Путь | Request type | Response type | Query params |
| --- | --- | --- | --- | --- |
| `ordersControllerFindMyOrders` | `GET /api/orders/my` | нет | `OrderViewDto[]` | нет |
| `ordersControllerApplyPromoCode` | `POST /api/orders/apply-promo-code` | нет | `PromoCodeUsageViewDto` | `orderId: string`, `code: string` |

**Analytics**

| Метод | Путь | Request type | Response type | Query params |
| --- | --- | --- | --- | --- |
| `analyticsControllerGetUsersAggregatedStats` | `GET /api/analytics/users` | нет | `AnalyticsUsersAggregatedStatsViewDto` | `datePreset`, `from`, `to`, `limit`, `offset`, `sortBy`, `sortDir`, `userId`, `email`, `name`, `phone`, `search` |
| `analyticsControllerGetPromoCodesAggregatedStats` | `GET /api/analytics/promo-codes` | нет | `AnalyticsPromoCodesAggregatedStatsViewDto` | `datePreset`, `from`, `to`, `limit`, `offset`, `sortBy`, `sortDir`, `promoCodeId`, `code`, `search` |
| `analyticsControllerGetPromoCodeUsageHistory` | `GET /api/analytics/promo-code-usage` | нет | `AnalyticsPromoCodeUsageHistoryViewDto` | `datePreset`, `from`, `to`, `limit`, `offset`, `sortBy`, `sortDir`, `promoCodeId`, `code`, `userId`, `orderId`, `email`, `name`, `phone`, `search` |
