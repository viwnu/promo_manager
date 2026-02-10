import { AnalyticsDatePreset, AnalyticsListOptions, AnalyticsListResult } from './analytics-base.types';

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

export type AnalyticsPromoCodesAggregatedStatsResult = AnalyticsListResult<AnalyticsPromoCodeAggregatedStats>;
export type AnalyticsPromoCodesDatePreset = AnalyticsDatePreset;

export type AnalyticsPromoCodesAggregatedStatsOptions = AnalyticsListOptions<
  keyof AnalyticsPromoCodeAggregatedStats,
  {
    promoCodeId?: string;
    code?: string;
    search?: string;
  }
>;
