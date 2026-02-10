import { ANALYTICS_PROMO_CODES_FIELDS, PROMO_CODE_FIELD_MAP } from '../initialization/queries/analytics-promo-codes.query';
import { AnalyticsPromoCodeAggregatedStats, AnalyticsPromoCodesDatePreset } from '../types/analytics-promo-codes.types';

export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function resolveDateRange(options: {
  datePreset?: AnalyticsPromoCodesDatePreset;
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

export function escapeString(value: string): string {
  return value.replace(/'/g, "''");
}
