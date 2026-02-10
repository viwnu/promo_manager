import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from '../initialization/queries/analytics-users.query';
import { AnalyticsUserAggregatedStats, AnalyticsUsersDatePreset } from '../types/analytics-users.types';

export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function resolveDateRange(options: {
  datePreset?: AnalyticsUsersDatePreset;
  from?: Date | string;
  to?: Date | string;
}): { from?: Date | string; to?: Date | string } {
  const preset = options.datePreset;
  if (!preset || preset === 'custom') {
    return { from: options.from, to: options.to };
  }

  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (preset === 'today') {
    return { from: end, to: end };
  }

  const days = preset === 'last7Days' ? 6 : 29;
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return { from: start, to: end };
}

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

export function escapeString(value: string): string {
  return value.replace(/'/g, "''");
}
