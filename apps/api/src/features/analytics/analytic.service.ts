import { CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient } from '@depyronick/nestjs-clickhouse';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from './initialization/queries/analytics-users.query';
import {
  AnalyticsUserAggregatedStats,
  AnalyticsUsersAggregatedStatsOptions,
  AnalyticsUsersAggregatedStatsResult,
} from './types/analytics-users.types';
import { escapeString, formatDate, resolveDateRange, resolveSortField } from './utils/analytics-users.utils';
import { AnalyticsUsersQueryDto } from './dto/analytics-users.query.dto';

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
