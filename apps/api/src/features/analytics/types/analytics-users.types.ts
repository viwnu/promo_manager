import { AnalyticsDatePreset, AnalyticsListOptions, AnalyticsListResult } from './analytics-base.types';

export interface AnalyticsUserAggregatedStats {
  user_id: string;
  email: string;
  name: string;
  phone: string;
  orders_count: number;
  orders_amount_sum: string;
  orders_amount_min: string;
  orders_amount_max: string;
  orders_amount_avg: string;
  promo_codes_used: number;
  promo_codes_unique: number;
  discount_sum: string;
  discount_min: string;
  discount_max: string;
  discount_avg: string;
}

export type AnalyticsUsersAggregatedStatsResult = AnalyticsListResult<AnalyticsUserAggregatedStats>;
export type AnalyticsUsersDatePreset = AnalyticsDatePreset;

export type AnalyticsUsersAggregatedStatsOptions = AnalyticsListOptions<
  keyof AnalyticsUserAggregatedStats,
  {
    userId?: string;
    email?: string;
    name?: string;
    phone?: string;
    search?: string;
  }
>;
