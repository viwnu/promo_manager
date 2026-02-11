import type { MRT_ColumnFiltersState } from "material-react-table";
import type { DateRange } from "../types/dateRange";
import { ensureRange } from "./dateRange";

type TableState = {
  pagination: { pageIndex: number; pageSize: number };
  sorting: { id: string; desc: boolean }[];
  debouncedGlobalFilter: string;
};

type BuildAnalyticsQueryBaseArgs = {
  dateRange: DateRange;
  tableState: TableState;
};

export function buildAnalyticsQueryBase({
  dateRange,
  tableState,
}: BuildAnalyticsQueryBaseArgs) {
  const range = ensureRange(dateRange);
  const { pageIndex, pageSize } = tableState.pagination;
  const [primarySort] = tableState.sorting;

  const base: Record<string, string | number | undefined> = {
    datePreset: range.preset,
    from: range.from,
    to: range.to,
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: tableState.debouncedGlobalFilter || undefined,
  };

  if (primarySort) {
    base.sortBy = primarySort.id;
    base.sortDir = primarySort.desc ? "desc" : "asc";
  }

  return base;
}

export function buildAnalyticsFiltersFromColumnFilters(
  columnFilters: MRT_ColumnFiltersState,
) {
  return columnFilters.reduce<Record<string, string>>((acc, filter) => {
    const raw = filter.value;
    if (raw === null || typeof raw === "undefined") {
      return acc;
    }
    const value = String(raw).trim();
    if (!value) {
      return acc;
    }
    acc[filter.id] = value;
    return acc;
  }, {});
}
