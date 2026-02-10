import { AnalyticsDatePreset, AnalyticsListOptions, AnalyticsListResult } from './analytics-base.types';

export interface AnalyticsPromoCodeUsageHistoryItem {
  used_at: string;
  promo_code_id: string;
  code: string;
  user_id: string;
  order_id: string;
  email: string;
  name: string;
  phone: string;
  order_amount: string;
  discount_amount: string;
}

export type AnalyticsPromoCodeUsageHistoryResult = AnalyticsListResult<AnalyticsPromoCodeUsageHistoryItem>;
export type AnalyticsPromoCodeUsageDatePreset = AnalyticsDatePreset;

export type AnalyticsPromoCodeUsageHistoryOptions = AnalyticsListOptions<
  keyof AnalyticsPromoCodeUsageHistoryItem,
  {
    promoCodeId?: string;
    code?: string;
    userId?: string;
    orderId?: string;
    email?: string;
    name?: string;
    phone?: string;
    search?: string;
  }
>;
