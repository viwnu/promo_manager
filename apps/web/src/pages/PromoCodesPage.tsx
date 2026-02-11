import { useMemo, useRef, useState } from "react";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef } from "material-react-table";
import { MaterialReactTable } from "material-react-table";
import type { PromoCodeViewDto } from "../api/source/Api";
import { normalizeErrorMessage } from "../api/httpError";
import { createPromoCode, disablePromoCode, listPromoCodes, updatePromoCode } from "../features/promoCodes/api";
import { PromoCodeFormDialog } from "../features/promoCodes/PromoCodeFormDialog";
import { ConfirmDialog } from "../shared/ui/ConfirmDialog";
import { Page } from "../shared/ui/Page";
import { TableScrollWrapper } from "../shared/ui/TableScrollWrapper";

export function PromoCodesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<PromoCodeViewDto | null>(null);
  const [disableOpen, setDisableOpen] = useState(false);

  const { data: promoCodes = [], isLoading } = useQuery<PromoCodeViewDto[]>({
    queryKey: ["promoCodes"],
    queryFn: listPromoCodes,
  });

  const createMutation = useMutation({
    mutationFn: createPromoCode,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
      enqueueSnackbar("Promo code created", { variant: "success" });
      setDialogOpen(false);
    },
    onError: (error) => {
      enqueueSnackbar(normalizeErrorMessage(error, "Create failed"), {
        variant: "error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Parameters<typeof updatePromoCode>[1] }) =>
      updatePromoCode(payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
      enqueueSnackbar("Promo code updated", { variant: "success" });
      setDialogOpen(false);
      setSelected(null);
    },
    onError: (error) => {
      enqueueSnackbar(normalizeErrorMessage(error, "Update failed"), {
        variant: "error",
      });
    },
  });

  const disableMutation = useMutation({
    mutationFn: disablePromoCode,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
      enqueueSnackbar("Promo code disabled", { variant: "success" });
      setDisableOpen(false);
      setSelected(null);
    },
    onError: (error) => {
      enqueueSnackbar(normalizeErrorMessage(error, "Disable failed"), {
        variant: "error",
      });
    },
  });

  const columns = useMemo<MRT_ColumnDef<PromoCodeViewDto>[]>(
    () => [
      { accessorKey: "code", header: "Code" },
      { accessorKey: "discount", header: "Discount %" },
      {
        accessorKey: "limit.overall",
        header: "Total limit",
        accessorFn: (row) => row.limit?.overall ?? "",
      },
      {
        accessorKey: "limit.perUser",
        header: "Per user limit",
        accessorFn: (row) => row.limit?.perUser ?? "",
      },
      {
        accessorKey: "active",
        header: "Active",
        accessorFn: (row) => (row.active ? "Yes" : "No"),
      },
      {
        accessorKey: "validityPeriod.start",
        header: "Start",
        accessorFn: (row) => row.validityPeriod?.start?.slice(0, 10) ?? "",
      },
      {
        accessorKey: "validityPeriod.end",
        header: "End",
        accessorFn: (row) => row.validityPeriod?.end?.slice(0, 10) ?? "",
      },
    ],
    [],
  );

  const openCreate = () => {
    setDialogMode("create");
    setSelected(null);
    setDialogOpen(true);
  };

  const openEdit = (row: PromoCodeViewDto) => {
    setDialogMode("edit");
    setSelected(row);
    setDialogOpen(true);
  };

  const openDisable = (row: PromoCodeViewDto) => {
    setSelected(row);
    setDisableOpen(true);
  };

  return (
    <Page
      title="Promo Codes"
      actions={
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Total: {promoCodes.length}
          </Typography>
        </Stack>
      }
    >
      <TableScrollWrapper containerRef={tableContainerRef}>
        <MaterialReactTable
          columns={columns}
          data={promoCodes}
          state={{ isLoading }}
          renderTopToolbarCustomActions={() => (
            <Tooltip title="Add Promo Codes">
              <IconButton
                size="medium"
                color="primary"
                onClick={openCreate}
                aria-label="Add Promo Codes"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: "grey.800",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                +
              </IconButton>
            </Tooltip>
          )}
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
              size: 180,
              minSize: 180,
            },
          }}
          renderRowActions={({ row }) => (
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => openEdit(row.original)}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={() => openDisable(row.original)}>
                Disable
              </Button>
            </Stack>
          )}
        />
      </TableScrollWrapper>

      <PromoCodeFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialValues={selected ?? undefined}
        loading={createMutation.isPending || updateMutation.isPending}
        onClose={() => setDialogOpen(false)}
        onSubmit={(payload) => {
          if (dialogMode === "create") {
            createMutation.mutate(payload as Parameters<typeof createPromoCode>[0]);
            return;
          }
          if (!selected) {
            enqueueSnackbar("No promo code selected", { variant: "warning" });
            return;
          }
          updateMutation.mutate({
            id: selected.id,
            data: payload as Parameters<typeof updatePromoCode>[1],
          });
        }}
      />

      <ConfirmDialog
        open={disableOpen}
        title="Disable promo code"
        description={selected ? `Disable promo code ${selected.code}?` : "Disable promo code?"}
        confirmLabel="Disable"
        loading={disableMutation.isPending}
        onCancel={() => setDisableOpen(false)}
        onConfirm={() => {
          if (!selected) {
            enqueueSnackbar("No promo code selected", { variant: "warning" });
            return;
          }
          disableMutation.mutate(selected.id);
        }}
      />
    </Page>
  );
}
