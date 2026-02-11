import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { UpdateUserDto } from "../../api/source/Api";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof schema>;

type UserFormDialogProps = {
  open: boolean;
  initialValues?: UpdateUserDto;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateUserDto) => void | Promise<void>;
};

export function UserFormDialog({
  open,
  initialValues,
  loading = false,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name || "",
    },
  });

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset(values);
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit user</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register("name")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
