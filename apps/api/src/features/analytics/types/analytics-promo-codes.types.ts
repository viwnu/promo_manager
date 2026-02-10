export interface AnalyticsPromoCodeAggregatedStats {
  promo_code_id: string;
  code: string;
  uses_count: number;
  unique_users: number;
  revenue_sum: string;
  order_amount_min: string;
  order_amount_max: string;
  order_amount_avg: string;
  discount_sum: string;
  discount_min: string;
  discount_max: string;
  discount_avg: string;
}

export interface AnalyticsPromoCodesAggregatedStatsResult {
  items: AnalyticsPromoCodeAggregatedStats[];
  total: number;
}

export type AnalyticsPromoCodesDatePreset = 'today' | 'last7Days' | 'last30Days' | 'custom';

export interface AnalyticsPromoCodesAggregatedStatsOptions {
  datePreset?: AnalyticsPromoCodesDatePreset;
  from?: Date | string;
  to?: Date | string;
  limit?: number;
  offset?: number;
  sortBy?: keyof AnalyticsPromoCodeAggregatedStats;
  sortDir?: 'asc' | 'desc';
  filter?: {
    promoCodeId?: string;
    code?: string;
    search?: string;
  };
}
