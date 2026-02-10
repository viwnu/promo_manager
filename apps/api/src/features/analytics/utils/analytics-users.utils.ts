import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from '../initialization/queries/analytics-users.query';
import { AnalyticsUserAggregatedStats } from '../types';
import { escapeString, formatDate, resolveDateRange } from './analytics-shared.utils';

export { formatDate, resolveDateRange, escapeString };

export function resolveSortField(sortBy?: keyof AnalyticsUserAggregatedStats): string {
  switch (sortBy) {
    case USER_FIELD_MAP.id.key:
    case USER_IDENTITY_FIELD_MAP.email.key:
    case USER_FIELD_MAP.name.key:
    case USER_FIELD_MAP.phone.key:
    case ANALYTICS_FIELDS.ordersCount.key:
    case ANALYTICS_FIELDS.ordersAmountSum.key:
    case ANALYTICS_FIELDS.ordersAmountMin.key:
    case ANALYTICS_FIELDS.ordersAmountMax.key:
    case ANALYTICS_FIELDS.ordersAmountAvg.key:
    case ANALYTICS_FIELDS.promoCodesUsed.key:
    case ANALYTICS_FIELDS.promoCodesUnique.key:
    case ANALYTICS_FIELDS.discountSum.key:
    case ANALYTICS_FIELDS.discountMin.key:
    case ANALYTICS_FIELDS.discountMax.key:
    case ANALYTICS_FIELDS.discountAvg.key:
      return sortBy;
    default:
      return ANALYTICS_FIELDS.ordersCount.key;
  }
}
