export type AnalyticsDatePreset = 'today' | 'last7Days' | 'last30Days' | 'custom';

export interface AnalyticsListResult<TItem> {
  items: TItem[];
  total: number;
}

export interface AnalyticsListOptions<TSortKey, TFilter> {
  datePreset?: AnalyticsDatePreset;
  from?: Date | string;
  to?: Date | string;
  limit?: number;
  offset?: number;
  sortBy?: TSortKey;
  sortDir?: 'asc' | 'desc';
  filter?: TFilter;
}
