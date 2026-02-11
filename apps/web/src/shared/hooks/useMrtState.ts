import { useMemo, useState } from "react";
import type { MRT_ColumnFiltersState, MRT_SortingState } from "material-react-table";
import { useDebounce } from "./useDebounce";

type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

type UseMrtStateOptions = {
  initialPageSize?: number;
};

export function useMrtState(options: UseMrtStateOptions = {}) {
  const { initialPageSize = 20 } = options;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const debouncedGlobalFilter = useDebounce(globalFilter, 350);

  const tableState = useMemo(
    () => ({
      pagination,
      sorting,
      columnFilters,
      globalFilter,
      debouncedGlobalFilter,
    }),
    [pagination, sorting, columnFilters, globalFilter, debouncedGlobalFilter],
  );

  return {
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
  } as const;
}
