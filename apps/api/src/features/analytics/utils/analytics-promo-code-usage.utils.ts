import { AnalyticsPromoCodeUsageHistoryItem } from '../types';
import { escapeString, formatDate, resolveDateRange } from './analytics-shared.utils';

export { formatDate, resolveDateRange, escapeString };

export function resolveSortField(sortBy?: keyof AnalyticsPromoCodeUsageHistoryItem): string {
  switch (sortBy) {
    case 'used_at':
    case 'promo_code_id':
    case 'code':
    case 'user_id':
    case 'order_id':
    case 'email':
    case 'name':
    case 'phone':
    case 'order_amount':
    case 'discount_amount':
      return sortBy;
    default:
      return 'used_at';
  }
}
