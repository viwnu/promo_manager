/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateUserDto {
  /**
   * The name of user
   * @example "Steven"
   */
  name: string;
  /**
   * The unique email address
   * @example "example@email.com"
   */
  email: string;
  /**
   * The password of user
   * @example "my-strong-password"
   */
  password: string;
}

export type BadRequestException = object;

export type ForbiddenException = object;

export type UserIdentityViewDTO = object;

export interface UserViewAllDTO {
  /**
   * The unique user id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  id: string;
  /**
   * User name
   * @example "Destroer 8000"
   */
  name: string;
  /** User identity */
  userIdentity: UserIdentityViewDTO;
}

export interface UserSelfView {
  /**
   * The unique user id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  id: string;
  /**
   * User name
   * @example "Destroer 8000"
   */
  name: string;
  /**
   * User email
   * @example "example@email.com"
   */
  email: string;
}

export type UnauthorizedException = object;

export interface UpdateUserDto {
  /**
   * The name of user
   * @example "Steven"
   */
  name: string;
}

export type NotFoundException = object;

export interface CreateUserIdentityModel {
  /**
   * user email
   * @example "example@email.com"
   */
  email: string;
  /**
   * user password
   * @example "my-strong-password"
   */
  password: string;
}

export interface RefreshToken {
  /**
   * refresh_token
   * @example "asdfgsdlfkg34kldnflgsdlfg"
   */
  refresh_token: string;
}

export interface PromoCodeLimitDto {
  /**
   * Overall usage limit
   * @example 1000
   */
  overall: number;
  /**
   * Usage limit per user
   * @example 1
   */
  perUser: number;
}

export interface PromoCodeValidityPeriodDto {
  /**
   * Start date of validity period
   * @format date-time
   * @example "2026-02-08T00:00:00.000Z"
   */
  start?: string;
  /**
   * End date of validity period
   * @format date-time
   * @example "2026-03-08T00:00:00.000Z"
   */
  end?: string;
}

export interface CreatePromoCodeDto {
  /**
   * Unique promo code
   * @example "SUMMER2026"
   */
  code: string;
  /**
   * Discount percentage
   * @example 15
   */
  discount: number;
  /** Usage limits */
  limit: PromoCodeLimitDto;
  /** Validity period */
  validityPeriod?: PromoCodeValidityPeriodDto;
  /**
   * Active status
   * @example true
   */
  active?: boolean;
}

export interface PromoCodeViewDto {
  /**
   * Promo code id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  id: string;
  /**
   * Unique promo code
   * @example "SUMMER2026"
   */
  code: string;
  /**
   * Discount percentage
   * @example 15
   */
  discount: number;
  /** Usage limits */
  limit: PromoCodeLimitDto;
  /** Validity period */
  validityPeriod?: PromoCodeValidityPeriodDto;
  /**
   * Active status
   * @example true
   */
  active: boolean;
}

export interface UpdatePromoCodeDto {
  /**
   * Unique promo code
   * @example "SUMMER2026"
   */
  code?: string;
  /**
   * Discount percentage
   * @example 15
   */
  discount?: number;
  /** Usage limits */
  limit?: PromoCodeLimitDto;
  /** Validity period */
  validityPeriod?: PromoCodeValidityPeriodDto;
}

export interface OrderViewDto {
  /**
   * Order id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  id: string;
  /**
   * User id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  userId: string;
  /**
   * Order amount
   * @example 199.99
   */
  amount: number;
  /**
   * Applied promo code
   * @example "SUMMER2026"
   */
  promoCode?: string;
  /**
   * Created at
   * @format date-time
   * @example "2026-02-08T10:00:00.000Z"
   */
  createdAt: string;
}

export interface PromoCodeUsageViewDto {
  /**
   * Usage id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  id: string;
  /**
   * Promo code id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  promoCodeId: string;
  /**
   * User id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  userId: string;
  /**
   * Order id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  orderId: string;
  /**
   * Calculated discount amount
   * @example 125.5
   */
  discountAmount: number;
  /**
   * Usage date
   * @format date-time
   * @example "2026-02-08T10:00:00.000Z"
   */
  createdAt: string;
}

export interface AnalyticsUserAggregatedStatsViewDto {
  /**
   * User id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  user_id: string;
  /**
   * Email
   * @example "user@email.com"
   */
  email: string;
  /**
   * Name
   * @example "John"
   */
  name: string;
  /**
   * Phone
   * @example "+12025550123"
   */
  phone: string;
  /**
   * Orders count
   * @example 5
   */
  orders_count: number;
  /**
   * Orders amount sum
   * @example "199.99"
   */
  orders_amount_sum: string;
  /**
   * Orders amount min
   * @example "10.00"
   */
  orders_amount_min: string;
  /**
   * Orders amount max
   * @example "500.00"
   */
  orders_amount_max: string;
  /**
   * Orders amount avg
   * @example "120.50"
   */
  orders_amount_avg: string;
  /**
   * Promo codes used
   * @example 2
   */
  promo_codes_used: number;
  /**
   * Unique promo codes used
   * @example 2
   */
  promo_codes_unique: number;
  /**
   * Discount sum
   * @example "15.00"
   */
  discount_sum: string;
  /**
   * Discount min
   * @example "5.00"
   */
  discount_min: string;
  /**
   * Discount max
   * @example "20.00"
   */
  discount_max: string;
  /**
   * Discount avg
   * @example "10.00"
   */
  discount_avg: string;
}

export interface AnalyticsUsersAggregatedStatsViewDto {
  /** Items */
  items: AnalyticsUserAggregatedStatsViewDto[];
  /**
   * Total items count
   * @example 120
   */
  total: number;
}

export interface AnalyticsPromoCodeAggregatedStatsViewDto {
  /**
   * Promo code id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  promo_code_id: string;
  /**
   * Promo code
   * @example "SUMMER2026"
   */
  code: string;
  /**
   * Uses count
   * @example 12
   */
  uses_count: number;
  /**
   * Unique users
   * @example 8
   */
  unique_users: number;
  /**
   * Revenue sum
   * @example "999.99"
   */
  revenue_sum: string;
  /**
   * Order amount min
   * @example "50.00"
   */
  order_amount_min: string;
  /**
   * Order amount max
   * @example "300.00"
   */
  order_amount_max: string;
  /**
   * Order amount avg
   * @example "120.00"
   */
  order_amount_avg: string;
  /**
   * Discount sum
   * @example "25.00"
   */
  discount_sum: string;
  /**
   * Discount min
   * @example "5.00"
   */
  discount_min: string;
  /**
   * Discount max
   * @example "40.00"
   */
  discount_max: string;
  /**
   * Discount avg
   * @example "15.00"
   */
  discount_avg: string;
}

export interface AnalyticsPromoCodesAggregatedStatsViewDto {
  /** Items */
  items: AnalyticsPromoCodeAggregatedStatsViewDto[];
  /**
   * Total items count
   * @example 120
   */
  total: number;
}

export interface AnalyticsPromoCodeUsageHistoryItemViewDto {
  /**
   * Used at
   * @format date-time
   * @example "2026-02-08T10:00:00.000Z"
   */
  used_at: string;
  /**
   * Promo code id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  promo_code_id: string;
  /**
   * Promo code
   * @example "SUMMER2026"
   */
  code: string;
  /**
   * User id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  user_id: string;
  /**
   * Order id
   * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
   */
  order_id: string;
  /**
   * Email
   * @example "user@email.com"
   */
  email: string;
  /**
   * Name
   * @example "John"
   */
  name: string;
  /**
   * Phone
   * @example "+12025550123"
   */
  phone: string;
  /**
   * Order amount
   * @example "199.99"
   */
  order_amount: string;
  /**
   * Discount amount
   * @example "10.00"
   */
  discount_amount: string;
}

export interface AnalyticsPromoCodeUsageHistoryViewDto {
  /** Items */
  items: AnalyticsPromoCodeUsageHistoryItemViewDto[];
  /**
   * Total items count
   * @example 120
   */
  total: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title REST API Chat
 * @version 1.0
 * @contact
 *
 * The REST API Chat API description
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Api
     * @name ApiControllerHealthCheck
     * @request GET:/api
     */
    apiControllerHealthCheck: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Logs
     * @name LoggerControllerGetLogs
     * @summary Return logs by data
     * @request GET:/api/logs
     */
    loggerControllerGetLogs: (
      query?: {
        /** @example "2025-06-22" */
        date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/logs`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerSignup
     * @summary Create User
     * @request POST:/api/users/signup
     */
    usersControllerSignup: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, BadRequestException | ForbiddenException>({
        path: `/api/users/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindAll
     * @summary Show all users
     * @request GET:/api/users
     */
    usersControllerFindAll: (params: RequestParams = {}) =>
      this.request<UserViewAllDTO[], any>({
        path: `/api/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerUpdate
     * @summary Update User
     * @request PATCH:/api/users
     * @secure
     */
    usersControllerUpdate: (data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<
        void,
        BadRequestException | UnauthorizedException | ForbiddenException
      >({
        path: `/api/users`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindOne
     * @summary Show User info for self
     * @request GET:/api/users/me
     * @secure
     */
    usersControllerFindOne: (params: RequestParams = {}) =>
      this.request<UserSelfView, UnauthorizedException | ForbiddenException>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerBan
     * @summary Ban User
     * @request PATCH:/api/users/ban
     * @secure
     */
    usersControllerBan: (
      query: {
        /**
         * The unique email address
         * @example "example@email.com"
         */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        void,
        | BadRequestException
        | UnauthorizedException
        | ForbiddenException
        | NotFoundException
      >({
        path: `/api/users/ban`,
        method: "PATCH",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @summary Login User and return refresh_token
     * @request POST:/api/auth/login
     */
    authControllerLogin: (
      data: CreateUserIdentityModel,
      params: RequestParams = {},
    ) =>
      this.request<RefreshToken, BadRequestException | UnauthorizedException>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRefresh
     * @summary Refresh and return refresh_token
     * @request POST:/api/auth/refresh
     */
    authControllerRefresh: (data: RefreshToken, params: RequestParams = {}) =>
      this.request<any, BadRequestException | UnauthorizedException>({
        path: `/api/auth/refresh`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogout
     * @summary Logout User clear cookies delete refreshToken
     * @request PATCH:/api/auth
     * @secure
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, UnauthorizedException>({
        path: `/api/auth`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo codes
     * @name PromoCodesControllerCreate
     * @summary Create promo code
     * @request POST:/api/promo-codes
     * @secure
     */
    promoCodesControllerCreate: (
      data: CreatePromoCodeDto,
      params: RequestParams = {},
    ) =>
      this.request<PromoCodeViewDto, BadRequestException | ForbiddenException>({
        path: `/api/promo-codes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo codes
     * @name PromoCodesControllerFindAll
     * @summary Show all promo codes
     * @request GET:/api/promo-codes
     * @secure
     */
    promoCodesControllerFindAll: (params: RequestParams = {}) =>
      this.request<PromoCodeViewDto[], any>({
        path: `/api/promo-codes`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo codes
     * @name PromoCodesControllerFindOne
     * @summary Show promo code by id
     * @request GET:/api/promo-codes/{id}
     * @secure
     */
    promoCodesControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<PromoCodeViewDto, NotFoundException>({
        path: `/api/promo-codes/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo codes
     * @name PromoCodesControllerUpdate
     * @summary Update promo code
     * @request PATCH:/api/promo-codes/{id}
     * @secure
     */
    promoCodesControllerUpdate: (
      id: string,
      data: UpdatePromoCodeDto,
      params: RequestParams = {},
    ) =>
      this.request<
        PromoCodeViewDto,
        BadRequestException | ForbiddenException | NotFoundException
      >({
        path: `/api/promo-codes/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Promo codes
     * @name PromoCodesControllerDisable
     * @summary Deactivate promo code
     * @request PATCH:/api/promo-codes/disable/{id}
     * @secure
     */
    promoCodesControllerDisable: (id: string, params: RequestParams = {}) =>
      this.request<PromoCodeViewDto, NotFoundException>({
        path: `/api/promo-codes/disable/${id}`,
        method: "PATCH",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerFindMyOrders
     * @summary Show my orders
     * @request GET:/api/orders/my
     * @secure
     */
    ordersControllerFindMyOrders: (params: RequestParams = {}) =>
      this.request<OrderViewDto[], any>({
        path: `/api/orders/my`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerApplyPromoCode
     * @summary Apply promo code to order
     * @request POST:/api/orders/apply-promo-code
     * @secure
     */
    ordersControllerApplyPromoCode: (
      query: {
        /**
         * Order id
         * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
         */
        orderId: string;
        /**
         * Promo code
         * @example "SUMMER2026"
         */
        code: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        PromoCodeUsageViewDto,
        BadRequestException | ForbiddenException | NotFoundException
      >({
        path: `/api/orders/apply-promo-code`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Analytics
     * @name AnalyticsControllerGetUsersAggregatedStats
     * @summary Get users aggregated statistics
     * @request GET:/api/analytics/users
     * @secure
     */
    analyticsControllerGetUsersAggregatedStats: (
      query?: {
        /** Date preset for stats range */
        datePreset?: "today" | "last7Days" | "last30Days" | "custom";
        /**
         * Start date
         * @format date
         * @example "2026-02-10"
         */
        from?: string;
        /**
         * End date
         * @format date
         * @example "2026-02-10"
         */
        to?: string;
        /**
         * Limit
         * @example 50
         */
        limit?: number;
        /**
         * Offset
         * @example 0
         */
        offset?: number;
        /**
         * Sort field
         * @example "orders_count"
         */
        sortBy?: string;
        /** Sort direction */
        sortDir?: "asc" | "desc";
        /**
         * User id
         * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
         */
        userId?: string;
        /**
         * Email
         * @example "user@email.com"
         */
        email?: string;
        /**
         * Name
         * @example "John"
         */
        name?: string;
        /**
         * Phone
         * @example "+12025550123"
         */
        phone?: string;
        /**
         * Search in email/name/phone
         * @example "john"
         */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AnalyticsUsersAggregatedStatsViewDto, any>({
        path: `/api/analytics/users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Analytics
     * @name AnalyticsControllerGetPromoCodesAggregatedStats
     * @summary Get promo codes aggregated statistics
     * @request GET:/api/analytics/promo-codes
     * @secure
     */
    analyticsControllerGetPromoCodesAggregatedStats: (
      query?: {
        /** Date preset for stats range */
        datePreset?: "today" | "last7Days" | "last30Days" | "custom";
        /**
         * Start date
         * @format date
         * @example "2026-02-10"
         */
        from?: string;
        /**
         * End date
         * @format date
         * @example "2026-02-10"
         */
        to?: string;
        /**
         * Limit
         * @example 50
         */
        limit?: number;
        /**
         * Offset
         * @example 0
         */
        offset?: number;
        /**
         * Sort field
         * @example "orders_count"
         */
        sortBy?: string;
        /** Sort direction */
        sortDir?: "asc" | "desc";
        /**
         * Promo code id
         * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
         */
        promoCodeId?: string;
        /**
         * Promo code
         * @example "SUMMER2026"
         */
        code?: string;
        /**
         * Search in code
         * @example "summer"
         */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AnalyticsPromoCodesAggregatedStatsViewDto, any>({
        path: `/api/analytics/promo-codes`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Analytics
     * @name AnalyticsControllerGetPromoCodeUsageHistory
     * @summary Get promo code usage history
     * @request GET:/api/analytics/promo-code-usage
     * @secure
     */
    analyticsControllerGetPromoCodeUsageHistory: (
      query?: {
        /** Date preset for stats range */
        datePreset?: "today" | "last7Days" | "last30Days" | "custom";
        /**
         * Start date
         * @format date
         * @example "2026-02-10"
         */
        from?: string;
        /**
         * End date
         * @format date
         * @example "2026-02-10"
         */
        to?: string;
        /**
         * Limit
         * @example 50
         */
        limit?: number;
        /**
         * Offset
         * @example 0
         */
        offset?: number;
        /**
         * Sort field
         * @example "orders_count"
         */
        sortBy?: string;
        /** Sort direction */
        sortDir?: "asc" | "desc";
        /**
         * Promo code id
         * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
         */
        promoCodeId?: string;
        /**
         * Promo code
         * @example "SUMMER2026"
         */
        code?: string;
        /**
         * User id
         * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
         */
        userId?: string;
        /**
         * Order id
         * @example "c47f3448-0a96-487f-b602-0a4529825fa2"
         */
        orderId?: string;
        /**
         * Email
         * @example "user@email.com"
         */
        email?: string;
        /**
         * Name
         * @example "John"
         */
        name?: string;
        /**
         * Phone
         * @example "+12025550123"
         */
        phone?: string;
        /**
         * Search in code/email/name/phone
         * @example "john"
         */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AnalyticsPromoCodeUsageHistoryViewDto, any>({
        path: `/api/analytics/promo-code-usage`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
