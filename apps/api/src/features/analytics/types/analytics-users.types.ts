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

export interface AnalyticsUsersAggregatedStatsResult {
  items: AnalyticsUserAggregatedStats[];
  total: number;
}

export type AnalyticsUsersDatePreset = 'today' | 'last7Days' | 'last30Days' | 'custom';

export interface AnalyticsUsersAggregatedStatsOptions {
  datePreset?: AnalyticsUsersDatePreset;
  from?: Date | string;
  to?: Date | string;
  limit?: number;
  offset?: number;
  sortBy?: keyof AnalyticsUserAggregatedStats;
  sortDir?: 'asc' | 'desc';
  filter?: {
    userId?: string;
    email?: string;
    name?: string;
    phone?: string;
    search?: string;
  };
}
