import { useMemo, useRef, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef } from "material-react-table";
import { MaterialReactTable } from "material-react-table";
import type { OrderViewDto } from "../api/source/Api";
import { normalizeErrorMessage } from "../api/httpError";
import { ApplyPromoDialog } from "../features/orders/ApplyPromoDialog";
import { applyPromoCode, listMyOrders } from "../features/orders/api";
import { Page } from "../shared/ui/Page";
import { TableScrollWrapper } from "../shared/ui/TableScrollWrapper";

export function OrdersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderViewDto | null>(null);

  const { data: orders = [], isLoading } = useQuery<OrderViewDto[]>({
    queryKey: ["orders", "my"],
    queryFn: listMyOrders,
  });

  const applyMutation = useMutation({
    mutationFn: ({ orderId, code }: { orderId: string; code: string }) =>
      applyPromoCode(orderId, code),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["analytics"] });
      enqueueSnackbar("Promo code applied", { variant: "success" });
      setApplyOpen(false);
      setSelectedOrder(null);
    },
    onError: (error) => {
      enqueueSnackbar(normalizeErrorMessage(error, "Apply promo failed"), {
        variant: "error",
      });
    },
  });

  const columns = useMemo<MRT_ColumnDef<OrderViewDto>[]>(
    () => [
      { accessorKey: "id", header: "Order ID" },
      { accessorKey: "amount", header: "Amount" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        accessorFn: (row) => row.createdAt?.slice(0, 19).replace("T", " "),
      },
      {
        accessorKey: "promoCode",
        header: "Promo Code",
        accessorFn: (row) => row.promoCode ?? "",
      },
      {
        accessorKey: "discountAmount",
        header: "Discount",
        accessorFn: (row) => (row as { discountAmount?: number }).discountAmount ?? "",
      },
    ],
    [],
  );

  const openApply = (order: OrderViewDto) => {
    setSelectedOrder(order);
    setApplyOpen(true);
  };

  return (
    <Page
      title="Orders"
      actions={
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Total: {orders.length}
          </Typography>
        </Stack>
      }
    >
      <TableScrollWrapper containerRef={tableContainerRef}>
        <MaterialReactTable
          columns={columns}
          data={orders}
          state={{ isLoading }}
          muiTableProps={{ sx: { tableLayout: "auto", width: "max-content", minWidth: "100%" } }}
          muiTableHeadCellProps={{ sx: { whiteSpace: "nowrap" } }}
          muiTableBodyCellProps={{ sx: { whiteSpace: "nowrap" } }}
          muiTableContainerProps={{
            ref: tableContainerRef,
            sx: { width: "100%", maxWidth: "100%", overflowX: "auto" },
          }}
          enableColumnVirtualization
          enableColumnFilters
          enablePagination
          enableSorting
          enableRowActions
          positionActionsColumn="first"
          displayColumnDefOptions={{
            "mrt-row-actions": {
              header: "Actions",
              size: 160,
            },
          }}
          renderRowActions={({ row }) => (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => openApply(row.original)}
            >
              Apply promo
            </Button>
          )}
        />
      </TableScrollWrapper>

      <ApplyPromoDialog
        open={applyOpen}
        loading={applyMutation.isPending}
        onClose={() => setApplyOpen(false)}
        onSubmit={(code) => {
          if (!selectedOrder) {
            enqueueSnackbar("No order selected", { variant: "warning" });
            return;
          }
          applyMutation.mutate({ orderId: selectedOrder.id, code });
        }}
      />
    </Page>
  );
}
