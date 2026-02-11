import { useMemo, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef } from "material-react-table";
import { MaterialReactTable } from "material-react-table";
import type { UserViewAllDTO } from "../api/source/Api";
import { normalizeErrorMessage } from "../api/httpError";
import { useAuth } from "../features/auth/useAuth";
import { listUsers, updateUser, banUserByEmail } from "../features/users/api";
import { UserFormDialog } from "../features/users/UserFormDialog";
import { ConfirmDialog } from "../shared/ui/ConfirmDialog";
import { Page } from "../shared/ui/Page";
import { TableScrollWrapper } from "../shared/ui/TableScrollWrapper";

export function UsersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserViewAllDTO | null>(null);
  const [banEmail, setBanEmail] = useState<string>("");

  const { data: usersResponse, isLoading } = useQuery<UserViewAllDTO[]>({
    queryKey: ["users"],
    queryFn: listUsers,
  });
  const users = usersResponse ?? [];

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar("User updated", { variant: "success" });
      setEditOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      enqueueSnackbar(normalizeErrorMessage(error, "Update failed"), {
        variant: "error",
      });
    },
  });

  const banMutation = useMutation({
    mutationFn: banUserByEmail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar("User banned", { variant: "success" });
      setBanOpen(false);
      setBanEmail("");
    },
    onError: (error) => {
      enqueueSnackbar(normalizeErrorMessage(error, "Ban failed"), {
        variant: "error",
      });
    },
  });

  const columns = useMemo<MRT_ColumnDef<UserViewAllDTO>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "userIdentity.email", header: "Email" },
      {
        id: "active",
        header: "Active",
        accessorFn: (row) => {
          const value = (row.userIdentity as { active?: boolean })?.active;
          if (typeof value === "boolean") {
            return value ? "Yes" : "No";
          }
          return "";
        },
      },
    ],
    [],
  );

  const handleEdit = (user: UserViewAllDTO) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleBan = (user: UserViewAllDTO) => {
    const email = (user.userIdentity as { email?: string })?.email;
    if (email) {
      setBanEmail(email);
      setBanOpen(true);
      return;
    }

    const manualEmail = window.prompt("Enter user email to ban:");
    if (manualEmail && manualEmail.trim()) {
      setBanEmail(manualEmail.trim());
      setBanOpen(true);
    }
  };

  return (
    <Page
      title="Users"
      actions={
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Total: {users.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current: {currentUser?.email ?? "—"}
          </Typography>
        </Stack>
      }
    >
      <Box>
        <TableScrollWrapper containerRef={tableContainerRef}>
          <MaterialReactTable
            columns={columns}
            data={users}
            state={{ isLoading }}
            enableColumnFilters
            enablePagination
            enableSorting
            muiTableProps={{ sx: { tableLayout: "auto", width: "100%" } }}
            muiTableHeadCellProps={{ sx: { whiteSpace: "nowrap" } }}
            muiTableBodyCellProps={{ sx: { whiteSpace: "nowrap" } }}
            muiTableContainerProps={{
              ref: tableContainerRef,
              sx: { width: "100%", maxWidth: "100%", overflowX: "auto" },
            }}
            displayColumnDefOptions={{
              "mrt-row-actions": {
                header: "Actions",
                size: 140,
                minSize: 140,
              },
            }}
            enableColumnVirtualization
            renderRowActions={({ row }) => {
              const rowEmail = (row.original.userIdentity as { email?: string })?.email?.toLowerCase();
              const currentEmail = currentUser?.email?.toLowerCase();
              const sameEmail = rowEmail && currentEmail && rowEmail === currentEmail;
              const sameName = currentUser?.name && row.original.name === currentUser.name;
              const isCurrent = Boolean(sameEmail || sameName);
              const isActive = (row.original.userIdentity as { active?: boolean })?.active;

              return (
                <Stack direction="row" spacing={1} sx={{ flexWrap: "nowrap" }}>
                  {isCurrent && (
                    <Button size="small" onClick={() => handleEdit(row.original)}>
                      Edit
                    </Button>
                  )}
                  {!isCurrent && isActive !== false && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleBan(row.original)}
                    >
                      Ban
                    </Button>
                  )}
                </Stack>
              );
            }}
            enableRowActions
            positionActionsColumn="first"
          />
        </TableScrollWrapper>
      </Box>

      <UserFormDialog
        open={editOpen}
        initialValues={selectedUser ? { name: selectedUser.name } : undefined}
        loading={updateMutation.isPending}
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => updateMutation.mutate(values)}
      />

      <ConfirmDialog
        open={banOpen}
        title="Ban user"
        description={
          banEmail ? `Ban user with email ${banEmail}?` : "Ban selected user?"
        }
        confirmLabel="Ban"
        loading={banMutation.isPending}
        onCancel={() => setBanOpen(false)}
        onConfirm={() => {
          if (!banEmail) {
            enqueueSnackbar("Email is required for ban", { variant: "warning" });
            return;
          }
          banMutation.mutate(banEmail);
        }}
      />
    </Page>
  );
}
