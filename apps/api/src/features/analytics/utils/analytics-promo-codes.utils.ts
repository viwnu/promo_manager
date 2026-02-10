import { ANALYTICS_PROMO_CODES_FIELDS, PROMO_CODE_FIELD_MAP } from '../initialization/queries/analytics-promo-codes.query';
import { AnalyticsPromoCodeAggregatedStats } from '../types';
import { escapeString, formatDate, resolveDateRange } from './analytics-shared.utils';

export { formatDate, resolveDateRange, escapeString };

export function resolveSortField(sortBy?: keyof AnalyticsPromoCodeAggregatedStats): string {
  switch (sortBy) {
    case PROMO_CODE_FIELD_MAP.id.key:
    case PROMO_CODE_FIELD_MAP.code.key:
    case ANALYTICS_PROMO_CODES_FIELDS.usesCount.key:
    case ANALYTICS_PROMO_CODES_FIELDS.uniqueUsers.key:
    case ANALYTICS_PROMO_CODES_FIELDS.revenueSum.key:
    case ANALYTICS_PROMO_CODES_FIELDS.orderAmountMin.key:
    case ANALYTICS_PROMO_CODES_FIELDS.orderAmountMax.key:
    case ANALYTICS_PROMO_CODES_FIELDS.orderAmountAvg.key:
    case ANALYTICS_PROMO_CODES_FIELDS.discountSum.key:
    case ANALYTICS_PROMO_CODES_FIELDS.discountMin.key:
    case ANALYTICS_PROMO_CODES_FIELDS.discountMax.key:
    case ANALYTICS_PROMO_CODES_FIELDS.discountAvg.key:
      return sortBy;
    default:
      return ANALYTICS_PROMO_CODES_FIELDS.usesCount.key;
  }
}
