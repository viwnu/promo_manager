import { useMemo, useRef } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_ColumnFiltersState } from "material-react-table";
import { MaterialReactTable } from "material-react-table";
import type {
  AnalyticsPromoCodeUsageHistoryItemViewDto,
  AnalyticsPromoCodeUsageHistoryViewDto,
} from "../../../api/source/Api";
import { getPromoCodeUsageHistory } from "../api";
import { useDateRangeSearchParams } from "../../../shared/hooks/useDateRangeSearchParams";
import { useMrtState } from "../../../shared/hooks/useMrtState";
import {
  buildAnalyticsFiltersFromColumnFilters,
  buildAnalyticsQueryBase,
} from "../../../shared/lib/analyticsQuery";
import { DateRangeFilter } from "../../../shared/ui/DateRangeFilter";
import { Page } from "../../../shared/ui/Page";
import { TableScrollWrapper } from "../../../shared/ui/TableScrollWrapper";

const FILTERABLE_COLUMNS = new Set([
  "promoCodeId",
  "code",
  "userId",
  "orderId",
  "email",
  "name",
  "phone",
]);

type AnalyticsRowsPayload = {
  items?: AnalyticsPromoCodeUsageHistoryItemViewDto[];
  rows?: AnalyticsPromoCodeUsageHistoryItemViewDto[];
  total?: number;
};

function getRowsPayload(
  data: AnalyticsPromoCodeUsageHistoryViewDto | AnalyticsRowsPayload | undefined,
): AnalyticsRowsPayload {
  if (!data) {
    return {};
  }
  if ("items" in data || "rows" in data || "total" in data) {
    return data as AnalyticsRowsPayload;
  }
  return {};
}

export function AnalyticsUsagePage() {
  const { range, setRange } = useDateRangeSearchParams();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    tableState,
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    debouncedGlobalFilter,
  } = useMrtState({ initialPageSize: 50 });

  const filteredColumnFilters = useMemo<MRT_ColumnFiltersState>(
    () => columnFilters.filter((filter: MRT_ColumnFiltersState[number]) => FILTERABLE_COLUMNS.has(filter.id)),
    [columnFilters],
  );

  const query = useMemo(() => {
    return {
      ...buildAnalyticsQueryBase({ dateRange: range, tableState }),
      ...buildAnalyticsFiltersFromColumnFilters(filteredColumnFilters),
    };
  }, [range, tableState, filteredColumnFilters]);

  const queryKey = useMemo(
    () => [
      "analytics",
      "usage",
      range,
      pagination,
      sorting,
      filteredColumnFilters,
      debouncedGlobalFilter,
    ],
    [range, pagination, sorting, filteredColumnFilters, debouncedGlobalFilter],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () => getPromoCodeUsageHistory(query),
    placeholderData: keepPreviousData,
  });

  const payload = getRowsPayload(data);
  const rows = payload.items ?? payload.rows ?? [];
  const total = payload.total ?? rows.length;

  const columns = useMemo<MRT_ColumnDef<AnalyticsPromoCodeUsageHistoryItemViewDto>[]>(
    () => [
      { accessorKey: "used_at", header: "Used at", enableColumnFilter: false },
      {
        id: "promoCodeId",
        header: "Promo Code ID",
        accessorFn: (row) => row.promo_code_id,
      },
      { accessorKey: "code", header: "Code" },
      {
        id: "userId",
        header: "User ID",
        accessorFn: (row) => row.user_id,
      },
      {
        id: "orderId",
        header: "Order ID",
        accessorFn: (row) => row.order_id,
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "order_amount", header: "Order amount", enableColumnFilter: false },
      { accessorKey: "discount_amount", header: "Discount amount", enableColumnFilter: false },
    ],
    [],
  );

  return (
    <Page
      title="Analytics: Usage"
      actions={
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <DateRangeFilter value={range} onChange={setRange} />
          <TextField
            size="small"
            label="Search"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
          <Typography variant="body2" color="text.secondary">
            Total: {total}
          </Typography>
        </Stack>
      }
    >
      <TableScrollWrapper containerRef={tableContainerRef}>
        <MaterialReactTable
          columns={columns}
          data={rows}
          manualPagination
          manualSorting
          manualFiltering
          rowCount={total}
          muiTableProps={{ sx: { tableLayout: "auto", width: "max-content", minWidth: "100%" } }}
          muiTableHeadCellProps={{ sx: { whiteSpace: "nowrap" } }}
          muiTableBodyCellProps={{ sx: { whiteSpace: "nowrap" } }}
          muiTableContainerProps={{
            ref: tableContainerRef,
            sx: { width: "100%", maxWidth: "100%", overflowX: "auto" },
          }}
          enableColumnVirtualization
          enableColumnFilters
          enableGlobalFilter
          enableSorting
          enablePagination
          state={{
            isLoading,
            showProgressBars: isFetching,
            pagination,
            sorting,
            columnFilters,
            globalFilter,
          }}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
        />
      </TableScrollWrapper>
    </Page>
  );
}
