import { useMemo, useRef } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_ColumnFiltersState } from "material-react-table";
import { MaterialReactTable } from "material-react-table";
import type {
  AnalyticsUserAggregatedStatsViewDto,
  AnalyticsUsersAggregatedStatsViewDto,
} from "../../../api/source/Api";
import { getUsersStats } from "../api";
import { useDateRangeSearchParams } from "../../../shared/hooks/useDateRangeSearchParams";
import { useMrtState } from "../../../shared/hooks/useMrtState";
import {
  buildAnalyticsFiltersFromColumnFilters,
  buildAnalyticsQueryBase,
} from "../../../shared/lib/analyticsQuery";
import { DateRangeFilter } from "../../../shared/ui/DateRangeFilter";
import { Page } from "../../../shared/ui/Page";
import { TableScrollWrapper } from "../../../shared/ui/TableScrollWrapper";

const FILTERABLE_COLUMNS = new Set(["userId", "email", "name", "phone"]);

type AnalyticsRowsPayload = {
  items?: AnalyticsUserAggregatedStatsViewDto[];
  rows?: AnalyticsUserAggregatedStatsViewDto[];
  total?: number;
};

function getRowsPayload(
  data: AnalyticsUsersAggregatedStatsViewDto | AnalyticsRowsPayload | undefined,
): AnalyticsRowsPayload {
  if (!data) {
    return {};
  }
  if ("items" in data || "rows" in data || "total" in data) {
    return data as AnalyticsRowsPayload;
  }
  return {};
}

export function AnalyticsUsersPage() {
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
      "users",
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
    queryFn: () => getUsersStats(query),
    placeholderData: keepPreviousData,
  });

  const payload = getRowsPayload(data);
  const rows = payload.items ?? payload.rows ?? [];
  const total = payload.total ?? rows.length;

  const columns = useMemo<MRT_ColumnDef<AnalyticsUserAggregatedStatsViewDto>[]>(
    () => [
      {
        id: "userId",
        header: "User ID",
        accessorFn: (row) => row.user_id,
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "orders_count", header: "Orders", enableColumnFilter: false },
      { accessorKey: "orders_amount_sum", header: "Orders sum", enableColumnFilter: false },
      { accessorKey: "orders_amount_min", header: "Orders min", enableColumnFilter: false },
      { accessorKey: "orders_amount_max", header: "Orders max", enableColumnFilter: false },
      { accessorKey: "orders_amount_avg", header: "Orders avg", enableColumnFilter: false },
      { accessorKey: "promo_codes_used", header: "Promo used", enableColumnFilter: false },
      { accessorKey: "promo_codes_unique", header: "Promo unique", enableColumnFilter: false },
      { accessorKey: "discount_sum", header: "Discount sum", enableColumnFilter: false },
      { accessorKey: "discount_min", header: "Discount min", enableColumnFilter: false },
      { accessorKey: "discount_max", header: "Discount max", enableColumnFilter: false },
      { accessorKey: "discount_avg", header: "Discount avg", enableColumnFilter: false },
    ],
    [],
  );

  return (
    <Page
      title="Analytics: Users"
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
