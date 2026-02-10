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

export interface AnalyticsPromoCodeUsageHistoryResult {
  items: AnalyticsPromoCodeUsageHistoryItem[];
  total: number;
}

export type AnalyticsPromoCodeUsageDatePreset = 'today' | 'last7Days' | 'last30Days' | 'custom';

export interface AnalyticsPromoCodeUsageHistoryOptions {
  datePreset?: AnalyticsPromoCodeUsageDatePreset;
  from?: Date | string;
  to?: Date | string;
  limit?: number;
  offset?: number;
  sortBy?: keyof AnalyticsPromoCodeUsageHistoryItem;
  sortDir?: 'asc' | 'desc';
  filter?: {
    promoCodeId?: string;
    code?: string;
    userId?: string;
    orderId?: string;
    email?: string;
    name?: string;
    phone?: string;
    search?: string;
  };
}
