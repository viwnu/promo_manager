import { api } from "../../api/apiClient";
import type {
  AnalyticsPromoCodesAggregatedStatsViewDto,
  AnalyticsPromoCodeUsageHistoryViewDto,
  AnalyticsUsersAggregatedStatsViewDto,
} from "../../api/source/Api";

type AnalyticsQuery = Record<string, string | number | undefined>;

export async function getUsersAnalytics(query: AnalyticsQuery) {
  const response = await api.api.analyticsControllerGetUsersAggregatedStats(query);
  return (response as { data?: AnalyticsUsersAggregatedStatsViewDto }).data ??
    (response as unknown as AnalyticsUsersAggregatedStatsViewDto);
}

export async function getUsersStats(query: AnalyticsQuery) {
  const response = await api.api.analyticsControllerGetUsersAggregatedStats(query);
  return (response as { data?: AnalyticsUsersAggregatedStatsViewDto }).data ??
    (response as unknown as AnalyticsUsersAggregatedStatsViewDto);
}

export async function getPromoCodesAnalytics(query: AnalyticsQuery) {
  const response = await api.api.analyticsControllerGetPromoCodesAggregatedStats(query);
  return (response as { data?: AnalyticsPromoCodesAggregatedStatsViewDto }).data ??
    (response as unknown as AnalyticsPromoCodesAggregatedStatsViewDto);
}

export async function getPromoCodesStats(query: AnalyticsQuery) {
  const response = await api.api.analyticsControllerGetPromoCodesAggregatedStats(query);
  return (response as { data?: AnalyticsPromoCodesAggregatedStatsViewDto }).data ??
    (response as unknown as AnalyticsPromoCodesAggregatedStatsViewDto);
}

export async function getPromoCodeUsageAnalytics(query: AnalyticsQuery) {
  const response = await api.api.analyticsControllerGetPromoCodeUsageHistory(query);
  return (response as { data?: AnalyticsPromoCodeUsageHistoryViewDto }).data ??
    (response as unknown as AnalyticsPromoCodeUsageHistoryViewDto);
}

export async function getPromoCodeUsageHistory(query: AnalyticsQuery) {
  const response = await api.api.analyticsControllerGetPromoCodeUsageHistory(query);
  return (response as { data?: AnalyticsPromoCodeUsageHistoryViewDto }).data ??
    (response as unknown as AnalyticsPromoCodeUsageHistoryViewDto);
}
