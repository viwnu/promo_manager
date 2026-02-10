import { CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient } from '@depyronick/nestjs-clickhouse';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from './initialization/queries/analytics-users.query';
import {
  AnalyticsUserAggregatedStats,
  AnalyticsUsersAggregatedStatsOptions,
  AnalyticsUsersAggregatedStatsResult,
} from './types/analytics-users.types';
import { escapeString, formatDate, resolveDateRange, resolveSortField } from './utils/analytics-users.utils';

@Injectable()
export class AnalyticService {
  private readonly logger = new Logger(AnalyticService.name);

  constructor(@Inject(CLICKHOUSE_ASYNC_INSTANCE_TOKEN) private readonly clickhouse: ClickHouseClient) {}

  async getUsersAggregatedStats(
    options: AnalyticsUsersAggregatedStatsOptions = {},
  ): Promise<AnalyticsUsersAggregatedStatsResult> {
    const { itemsQuery, countQuery } = this.buildUsersAggregatedQueries(options);

    const [items, totalRows] = await Promise.all([
      this.queryRows<AnalyticsUserAggregatedStats>(itemsQuery),
      this.queryRows<{ total: number }>(countQuery),
    ]);

    return {
      items,
      total: totalRows[0]?.total ?? 0,
    };
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
