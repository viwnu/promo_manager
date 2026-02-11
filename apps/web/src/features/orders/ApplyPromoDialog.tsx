import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1, "Promo code is required"),
});

type FormValues = z.infer<typeof schema>;

type ApplyPromoDialogProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void | Promise<void>;
};

export function ApplyPromoDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: ApplyPromoDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!open) {
      reset({ code: "" });
    }
  }, [open, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit(values.code.toUpperCase());
    reset({ code: "" });
  });

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Apply promo code</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="Promo code"
          fullWidth
          margin="normal"
          error={Boolean(errors.code)}
          helperText={errors.code?.message}
          {...register("code", {
            onChange: (event) => setValue("code", event.target.value.toUpperCase()),
          })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
