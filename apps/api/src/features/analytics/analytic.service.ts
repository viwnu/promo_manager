import { CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient } from '@depyronick/nestjs-clickhouse';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from './initialization/queries/analytics-users.query';
import { ANALYTICS_PROMO_CODES_FIELDS, PROMO_CODE_FIELD_MAP } from './initialization/queries/analytics-promo-codes.query';
import {
  PROMO_CODE_USAGE_FIELD_MAP,
  PROMO_CODE_USAGE_USER_FIELDS,
  PROMO_CODE_CODE_FIELD,
} from './initialization/queries/raw-promo-code-usage.query';
import {
  AnalyticsUserAggregatedStats,
  AnalyticsUsersAggregatedStatsOptions,
  AnalyticsUsersAggregatedStatsResult,
} from './types/analytics-users.types';
import {
  AnalyticsPromoCodeAggregatedStats,
  AnalyticsPromoCodesAggregatedStatsOptions,
  AnalyticsPromoCodesAggregatedStatsResult,
} from './types/analytics-promo-codes.types';
import {
  AnalyticsPromoCodeUsageHistoryItem,
  AnalyticsPromoCodeUsageHistoryOptions,
  AnalyticsPromoCodeUsageHistoryResult,
} from './types/analytics-promo-code-usage.types';
import { escapeString, formatDate, resolveDateRange, resolveSortField } from './utils/analytics-users.utils';
import {
  escapeString as escapePromoString,
  formatDate as formatPromoDate,
  resolveDateRange as resolvePromoDateRange,
  resolveSortField as resolvePromoSortField,
} from './utils/analytics-promo-codes.utils';
import {
  escapeString as escapeUsageString,
  formatDate as formatUsageDate,
  resolveDateRange as resolveUsageDateRange,
  resolveSortField as resolveUsageSortField,
} from './utils/analytics-promo-code-usage.utils';
import { AnalyticsUsersQueryDto } from './dto/analytics-users.query.dto';
import { AnalyticsPromoCodesQueryDto } from './dto/analytics-promo-codes.query.dto';
import { AnalyticsPromoCodeUsageQueryDto } from './dto/analytics-promo-code-usage.query.dto';

@Injectable()
export class AnalyticService {
  private readonly logger = new Logger(AnalyticService.name);

  constructor(@Inject(CLICKHOUSE_ASYNC_INSTANCE_TOKEN) private readonly clickhouse: ClickHouseClient) {}

  async getUsersAggregatedStats(
    options: AnalyticsUsersAggregatedStatsOptions = {},
  ): Promise<AnalyticsUsersAggregatedStatsResult> {
    const normalizedOptions = this.normalizeUsersAggregatedOptions(options);
    const { itemsQuery, countQuery } = this.buildUsersAggregatedQueries(normalizedOptions);

    const [items, totalRows] = await Promise.all([
      this.queryRows<AnalyticsUserAggregatedStats>(itemsQuery),
      this.queryRows<{ total: number }>(countQuery),
    ]);

    return {
      items,
      total: totalRows[0]?.total ?? 0,
    };
  }

  async getUsersAggregatedStatsFromQuery(query: AnalyticsUsersQueryDto): Promise<AnalyticsUsersAggregatedStatsResult> {
    return this.getUsersAggregatedStats(this.mapQueryToOptions(query));
  }

  async getPromoCodesAggregatedStats(
    options: AnalyticsPromoCodesAggregatedStatsOptions = {},
  ): Promise<AnalyticsPromoCodesAggregatedStatsResult> {
    const normalizedOptions = this.normalizePromoCodesAggregatedOptions(options);
    const { itemsQuery, countQuery } = this.buildPromoCodesAggregatedQueries(normalizedOptions);

    const [items, totalRows] = await Promise.all([
      this.queryRows<AnalyticsPromoCodeAggregatedStats>(itemsQuery),
      this.queryRows<{ total: number }>(countQuery),
    ]);

    return {
      items,
      total: totalRows[0]?.total ?? 0,
    };
  }

  async getPromoCodesAggregatedStatsFromQuery(
    query: AnalyticsPromoCodesQueryDto,
  ): Promise<AnalyticsPromoCodesAggregatedStatsResult> {
    return this.getPromoCodesAggregatedStats(this.mapPromoQueryToOptions(query));
  }

  async getPromoCodeUsageHistory(
    options: AnalyticsPromoCodeUsageHistoryOptions = {},
  ): Promise<AnalyticsPromoCodeUsageHistoryResult> {
    const normalizedOptions = this.normalizePromoCodeUsageOptions(options);
    const { itemsQuery, countQuery } = this.buildPromoCodeUsageQueries(normalizedOptions);

    const [items, totalRows] = await Promise.all([
      this.queryRows<AnalyticsPromoCodeUsageHistoryItem>(itemsQuery),
      this.queryRows<{ total: number }>(countQuery),
    ]);

    return {
      items,
      total: totalRows[0]?.total ?? 0,
    };
  }

  async getPromoCodeUsageHistoryFromQuery(
    query: AnalyticsPromoCodeUsageQueryDto,
  ): Promise<AnalyticsPromoCodeUsageHistoryResult> {
    return this.getPromoCodeUsageHistory(this.mapPromoUsageQueryToOptions(query));
  }

  private buildUsersAggregatedQueries(options: AnalyticsUsersAggregatedStatsOptions): {
    itemsQuery: string;
    countQuery: string;
  } {
    const dateRange = resolveDateRange(options);
    const whereParts: string[] = [];
    if (dateRange.from) {
      whereParts.push(`${ANALYTICS_FIELDS.statsDate.key} >= toDate('${formatDate(dateRange.from)}')`);
    }
    if (dateRange.to) {
      whereParts.push(`${ANALYTICS_FIELDS.statsDate.key} <= toDate('${formatDate(dateRange.to)}')`);
    }

    const filter = options.filter;
    if (filter?.userId) {
      whereParts.push(`${USER_FIELD_MAP.id.key} = '${escapeString(filter.userId)}'`);
    }
    if (filter?.email) {
      whereParts.push(`${USER_IDENTITY_FIELD_MAP.email.key} = '${escapeString(filter.email)}'`);
    }
    if (filter?.name) {
      whereParts.push(`positionCaseInsensitive(${USER_FIELD_MAP.name.key}, '${escapeString(filter.name)}') > 0`);
    }
    if (filter?.phone) {
      whereParts.push(`positionCaseInsensitive(${USER_FIELD_MAP.phone.key}, '${escapeString(filter.phone)}') > 0`);
    }
    if (filter?.search) {
      const term = escapeString(filter.search);
      whereParts.push(
        `(positionCaseInsensitive(${USER_IDENTITY_FIELD_MAP.email.key}, '${term}') > 0 OR ` +
          `positionCaseInsensitive(${USER_FIELD_MAP.name.key}, '${term}') > 0 OR ` +
          `positionCaseInsensitive(${USER_FIELD_MAP.phone.key}, '${term}') > 0)`,
      );
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';
    const sortField = resolveSortField(options.sortBy);
    const sortDir = options.sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const orderByClause = `ORDER BY ${sortField} ${sortDir}`;
    const limitClause = typeof options.limit === 'number' ? `LIMIT ${options.limit}` : '';
    const offsetClause = typeof options.offset === 'number' ? `OFFSET ${options.offset}` : '';

    const baseQuery = `
SELECT
  ${USER_FIELD_MAP.id.key} AS ${USER_FIELD_MAP.id.key},
  ${USER_IDENTITY_FIELD_MAP.email.key} AS ${USER_IDENTITY_FIELD_MAP.email.key},
  ${USER_FIELD_MAP.name.key} AS ${USER_FIELD_MAP.name.key},
  ${USER_FIELD_MAP.phone.key} AS ${USER_FIELD_MAP.phone.key},
  countMerge(${ANALYTICS_FIELDS.ordersCount.key}) AS ${ANALYTICS_FIELDS.ordersCount.key},
  sumMerge(${ANALYTICS_FIELDS.ordersAmountSum.key}) AS ${ANALYTICS_FIELDS.ordersAmountSum.key},
  minMerge(${ANALYTICS_FIELDS.ordersAmountMin.key}) AS ${ANALYTICS_FIELDS.ordersAmountMin.key},
  maxMerge(${ANALYTICS_FIELDS.ordersAmountMax.key}) AS ${ANALYTICS_FIELDS.ordersAmountMax.key},
  avgMerge(${ANALYTICS_FIELDS.ordersAmountAvg.key}) AS ${ANALYTICS_FIELDS.ordersAmountAvg.key},
  countMerge(${ANALYTICS_FIELDS.promoCodesUsed.key}) AS ${ANALYTICS_FIELDS.promoCodesUsed.key},
  uniqExactMerge(${ANALYTICS_FIELDS.promoCodesUnique.key}) AS ${ANALYTICS_FIELDS.promoCodesUnique.key},
  sumMerge(${ANALYTICS_FIELDS.discountSum.key}) AS ${ANALYTICS_FIELDS.discountSum.key},
  minMerge(${ANALYTICS_FIELDS.discountMin.key}) AS ${ANALYTICS_FIELDS.discountMin.key},
  maxMerge(${ANALYTICS_FIELDS.discountMax.key}) AS ${ANALYTICS_FIELDS.discountMax.key},
  avgMerge(${ANALYTICS_FIELDS.discountAvg.key}) AS ${ANALYTICS_FIELDS.discountAvg.key}
FROM analytics_users
${whereClause}
GROUP BY ${USER_FIELD_MAP.id.key}, ${USER_IDENTITY_FIELD_MAP.email.key}, ${USER_FIELD_MAP.name.key}, ${USER_FIELD_MAP.phone.key}
`;

    const itemsQuery = `
${baseQuery}
${orderByClause}
${limitClause}
${offsetClause}
`;

    const countQuery = `
SELECT count() AS total
FROM (
${baseQuery}
)
`;

    return { itemsQuery, countQuery };
  }

  private buildPromoCodesAggregatedQueries(options: AnalyticsPromoCodesAggregatedStatsOptions): {
    itemsQuery: string;
    countQuery: string;
  } {
    const dateRange = resolvePromoDateRange(options);
    const whereParts: string[] = [];
    if (dateRange.from) {
      whereParts.push(`${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key} >= toDate('${formatPromoDate(dateRange.from)}')`);
    }
    if (dateRange.to) {
      whereParts.push(`${ANALYTICS_PROMO_CODES_FIELDS.statsDate.key} <= toDate('${formatPromoDate(dateRange.to)}')`);
    }

    const filter = options.filter;
    if (filter?.promoCodeId) {
      whereParts.push(`${PROMO_CODE_FIELD_MAP.id.key} = '${escapePromoString(filter.promoCodeId)}'`);
    }
    if (filter?.code) {
      whereParts.push(`${PROMO_CODE_FIELD_MAP.code.key} = '${escapePromoString(filter.code)}'`);
    }
    if (filter?.search) {
      const term = escapePromoString(filter.search);
      whereParts.push(`positionCaseInsensitive(${PROMO_CODE_FIELD_MAP.code.key}, '${term}') > 0`);
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';
    const sortField = resolvePromoSortField(options.sortBy);
    const sortDir = options.sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const orderByClause = `ORDER BY ${sortField} ${sortDir}`;
    const limitClause = typeof options.limit === 'number' ? `LIMIT ${options.limit}` : '';
    const offsetClause = typeof options.offset === 'number' ? `OFFSET ${options.offset}` : '';

    const baseQuery = `
SELECT
  ${PROMO_CODE_FIELD_MAP.id.key} AS ${PROMO_CODE_FIELD_MAP.id.key},
  ${PROMO_CODE_FIELD_MAP.code.key} AS ${PROMO_CODE_FIELD_MAP.code.key},
  countMerge(${ANALYTICS_PROMO_CODES_FIELDS.usesCount.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.usesCount.key},
  uniqExactMerge(${ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.key},
  sumMerge(${ANALYTICS_PROMO_CODES_FIELDS.revenueSum.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.revenueSum.key},
  minMerge(${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMin.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMin.key},
  maxMerge(${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMax.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountMax.key},
  avgMerge(${ANALYTICS_PROMO_CODES_FIELDS.orderAmountAvg.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.orderAmountAvg.key},
  sumMerge(${ANALYTICS_PROMO_CODES_FIELDS.discountSum.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.discountSum.key},
  minMerge(${ANALYTICS_PROMO_CODES_FIELDS.discountMin.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.discountMin.key},
  maxMerge(${ANALYTICS_PROMO_CODES_FIELDS.discountMax.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.discountMax.key},
  avgMerge(${ANALYTICS_PROMO_CODES_FIELDS.discountAvg.key}) AS ${ANALYTICS_PROMO_CODES_FIELDS.discountAvg.key}
FROM analytics_promo_codes
${whereClause}
GROUP BY ${PROMO_CODE_FIELD_MAP.id.key}, ${PROMO_CODE_FIELD_MAP.code.key}
`;

    const itemsQuery = `
${baseQuery}
${orderByClause}
${limitClause}
${offsetClause}
`;

    const countQuery = `
SELECT count() AS total
FROM (
${baseQuery}
)
`;

    return { itemsQuery, countQuery };
  }

  private buildPromoCodeUsageQueries(options: AnalyticsPromoCodeUsageHistoryOptions): {
    itemsQuery: string;
    countQuery: string;
  } {
    const dateRange = resolveUsageDateRange(options);
    const whereParts: string[] = [];
    if (dateRange.from) {
      whereParts.push(
        `toDate(${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key}) >= toDate('${formatUsageDate(dateRange.from)}')`,
      );
    }
    if (dateRange.to) {
      whereParts.push(
        `toDate(${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key}) <= toDate('${formatUsageDate(dateRange.to)}')`,
      );
    }

    const filter = options.filter;
    if (filter?.promoCodeId) {
      whereParts.push(`${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key} = '${escapeUsageString(filter.promoCodeId)}'`);
    }
    if (filter?.code) {
      whereParts.push(`${PROMO_CODE_CODE_FIELD.key} = '${escapeUsageString(filter.code)}'`);
    }
    if (filter?.userId) {
      whereParts.push(`${PROMO_CODE_USAGE_FIELD_MAP.userId.key} = '${escapeUsageString(filter.userId)}'`);
    }
    if (filter?.orderId) {
      whereParts.push(`${PROMO_CODE_USAGE_FIELD_MAP.orderId.key} = '${escapeUsageString(filter.orderId)}'`);
    }
    if (filter?.email) {
      whereParts.push(`${PROMO_CODE_USAGE_USER_FIELDS.email.key} = '${escapeUsageString(filter.email)}'`);
    }
    if (filter?.name) {
      whereParts.push(
        `positionCaseInsensitive(${PROMO_CODE_USAGE_USER_FIELDS.name.key}, '${escapeUsageString(filter.name)}') > 0`,
      );
    }
    if (filter?.phone) {
      whereParts.push(
        `positionCaseInsensitive(${PROMO_CODE_USAGE_USER_FIELDS.phone.key}, '${escapeUsageString(filter.phone)}') > 0`,
      );
    }
    if (filter?.search) {
      const term = escapeUsageString(filter.search);
      whereParts.push(
        `(positionCaseInsensitive(${PROMO_CODE_CODE_FIELD.key}, '${term}') > 0 OR ` +
          `positionCaseInsensitive(${PROMO_CODE_USAGE_USER_FIELDS.email.key}, '${term}') > 0 OR ` +
          `positionCaseInsensitive(${PROMO_CODE_USAGE_USER_FIELDS.name.key}, '${term}') > 0 OR ` +
          `positionCaseInsensitive(${PROMO_CODE_USAGE_USER_FIELDS.phone.key}, '${term}') > 0)`,
      );
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';
    const sortField = resolveUsageSortField(options.sortBy);
    const sortDir = options.sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const orderByClause = `ORDER BY ${sortField} ${sortDir}`;
    const limitClause = typeof options.limit === 'number' ? `LIMIT ${options.limit}` : '';
    const offsetClause = typeof options.offset === 'number' ? `OFFSET ${options.offset}` : '';

    const baseQuery = `
SELECT
  ${PROMO_CODE_USAGE_FIELD_MAP.createdAt.key} AS used_at,
  ${PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key} AS promo_code_id,
  ${PROMO_CODE_CODE_FIELD.key} AS code,
  ${PROMO_CODE_USAGE_FIELD_MAP.userId.key} AS user_id,
  ${PROMO_CODE_USAGE_FIELD_MAP.orderId.key} AS order_id,
  ${PROMO_CODE_USAGE_USER_FIELDS.email.key} AS email,
  ${PROMO_CODE_USAGE_USER_FIELDS.name.key} AS name,
  ${PROMO_CODE_USAGE_USER_FIELDS.phone.key} AS phone,
  ${PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key} AS order_amount,
  ${PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key} AS discount_amount
FROM raw_promo_code_usage
${whereClause}
`;

    const itemsQuery = `
${baseQuery}
${orderByClause}
${limitClause}
${offsetClause}
`;

    const countQuery = `
SELECT count() AS total
FROM (
${baseQuery}
)
`;

    return { itemsQuery, countQuery };
  }

  private normalizeUsersAggregatedOptions(options: AnalyticsUsersAggregatedStatsOptions): AnalyticsUsersAggregatedStatsOptions {
    const filter = options.filter ?? {};
    return {
      ...options,
      sortBy: options.sortBy as AnalyticsUsersAggregatedStatsOptions['sortBy'],
      filter: {
        userId: filter.userId,
        email: filter.email,
        name: filter.name,
        phone: filter.phone,
        search: filter.search,
      },
    };
  }

  private normalizePromoCodesAggregatedOptions(
    options: AnalyticsPromoCodesAggregatedStatsOptions,
  ): AnalyticsPromoCodesAggregatedStatsOptions {
    const filter = options.filter ?? {};
    return {
      ...options,
      sortBy: options.sortBy as AnalyticsPromoCodesAggregatedStatsOptions['sortBy'],
      filter: {
        promoCodeId: filter.promoCodeId,
        code: filter.code,
        search: filter.search,
      },
    };
  }

  private normalizePromoCodeUsageOptions(
    options: AnalyticsPromoCodeUsageHistoryOptions,
  ): AnalyticsPromoCodeUsageHistoryOptions {
    const filter = options.filter ?? {};
    return {
      ...options,
      sortBy: options.sortBy as AnalyticsPromoCodeUsageHistoryOptions['sortBy'],
      filter: {
        promoCodeId: filter.promoCodeId,
        code: filter.code,
        userId: filter.userId,
        orderId: filter.orderId,
        email: filter.email,
        name: filter.name,
        phone: filter.phone,
        search: filter.search,
      },
    };
  }

  private mapQueryToOptions(query: AnalyticsUsersQueryDto): AnalyticsUsersAggregatedStatsOptions {
    return {
      datePreset: query.datePreset,
      from: query.from,
      to: query.to,
      limit: query.limit,
      offset: query.offset,
      sortBy: query.sortBy as AnalyticsUsersAggregatedStatsOptions['sortBy'],
      sortDir: query.sortDir,
      filter: {
        userId: query.userId,
        email: query.email,
        name: query.name,
        phone: query.phone,
        search: query.search,
      },
    };
  }

  private mapPromoQueryToOptions(query: AnalyticsPromoCodesQueryDto): AnalyticsPromoCodesAggregatedStatsOptions {
    return {
      datePreset: query.datePreset,
      from: query.from,
      to: query.to,
      limit: query.limit,
      offset: query.offset,
      sortBy: query.sortBy as AnalyticsPromoCodesAggregatedStatsOptions['sortBy'],
      sortDir: query.sortDir,
      filter: {
        promoCodeId: query.promoCodeId,
        code: query.code,
        search: query.search,
      },
    };
  }

  private mapPromoUsageQueryToOptions(query: AnalyticsPromoCodeUsageQueryDto): AnalyticsPromoCodeUsageHistoryOptions {
    return {
      datePreset: query.datePreset,
      from: query.from,
      to: query.to,
      limit: query.limit,
      offset: query.offset,
      sortBy: query.sortBy as AnalyticsPromoCodeUsageHistoryOptions['sortBy'],
      sortDir: query.sortDir,
      filter: {
        promoCodeId: query.promoCodeId,
        code: query.code,
        userId: query.userId,
        orderId: query.orderId,
        email: query.email,
        name: query.name,
        phone: query.phone,
        search: query.search,
      },
    };
  }

  private async queryRows<T>(query: string): Promise<T[]> {
    const result = await this.clickhouse.queryPromise<T>(query);
    if (Array.isArray(result)) {
      return result;
    }

    try {
      const parsed = JSON.parse(result);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch (error) {
      this.logger.warn(`ClickHouse query returned non-array response: ${query}`, error as Error);
      return [];
    }
  }
}
