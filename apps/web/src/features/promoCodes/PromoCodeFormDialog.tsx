import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CreatePromoCodeDto, UpdatePromoCodeDto } from "../../api/source/Api";

const schema = z
  .object({
    code: z.string().min(1, "Code is required"),
    discount: z.coerce.number().min(1, "Min 1").max(100, "Max 100"),
    limitOverall: z.coerce.number().min(0, "Must be >= 0"),
    limitPerUser: z.coerce.number().min(0, "Must be >= 0"),
    active: z.boolean().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
  })
  .refine(
    (values) => {
      if (!values.start || !values.end) {
        return true;
      }
      return values.start <= values.end;
    },
    { message: "Start date must be <= end date", path: ["end"] },
  );

type FormValues = z.infer<typeof schema>;

type PromoCodeFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<CreatePromoCodeDto & UpdatePromoCodeDto>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePromoCodeDto | UpdatePromoCodeDto) => void | Promise<void>;
};

export function PromoCodeFormDialog({
  open,
  mode,
  initialValues,
  loading = false,
  onClose,
  onSubmit,
}: PromoCodeFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      code: initialValues?.code || "",
      discount: initialValues?.discount ?? 1,
      limitOverall: initialValues?.limit?.overall ?? 0,
      limitPerUser: initialValues?.limit?.perUser ?? 0,
      active: initialValues?.active ?? true,
      start: initialValues?.validityPeriod?.start
        ? initialValues.validityPeriod.start.slice(0, 10)
        : "",
      end: initialValues?.validityPeriod?.end
        ? initialValues.validityPeriod.end.slice(0, 10)
        : "",
    },
  });

  useEffect(() => {
    reset({
      code: initialValues?.code || "",
      discount: initialValues?.discount ?? 1,
      limitOverall: initialValues?.limit?.overall ?? 0,
      limitPerUser: initialValues?.limit?.perUser ?? 0,
      active: initialValues?.active ?? true,
      start: initialValues?.validityPeriod?.start
        ? initialValues.validityPeriod.start.slice(0, 10)
        : "",
      end: initialValues?.validityPeriod?.end
        ? initialValues.validityPeriod.end.slice(0, 10)
        : "",
    });
  }, [initialValues, reset]);

  const submit = handleSubmit(async (values) => {
    const payload = {
      code: values.code.toUpperCase(),
      discount: values.discount,
      limit: {
        overall: values.limitOverall,
        perUser: values.limitPerUser,
      },
      validityPeriod:
        values.start || values.end
          ? {
              start: values.start ? new Date(values.start).toISOString() : undefined,
              end: values.end ? new Date(values.end).toISOString() : undefined,
            }
          : undefined,
      active: values.active,
    };

    if (mode === "edit") {
      const updatePayload: UpdatePromoCodeDto = {
        code: payload.code,
        discount: payload.discount,
        limit: payload.limit,
        validityPeriod: payload.validityPeriod,
      };
      await onSubmit(updatePayload);
      return;
    }

    const createPayload: CreatePromoCodeDto = {
      code: payload.code,
      discount: payload.discount,
      limit: payload.limit,
      validityPeriod: payload.validityPeriod,
      active: payload.active,
    };
    await onSubmit(createPayload);
  });

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "create" ? "Create promo code" : "Edit promo code"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Code"
            fullWidth
            error={Boolean(errors.code)}
            helperText={errors.code?.message}
            {...register("code", {
              onChange: (event) => setValue("code", event.target.value.toUpperCase()),
            })}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Discount %"
              type="number"
              fullWidth
              error={Boolean(errors.discount)}
              helperText={errors.discount?.message}
              inputProps={{ min: 1, max: 100 }}
              {...register("discount")}
            />
            <TextField
              label="Total limit"
              type="number"
              fullWidth
              error={Boolean(errors.limitOverall)}
              helperText={errors.limitOverall?.message}
              inputProps={{ min: 0 }}
              {...register("limitOverall")}
            />
            <TextField
              label="Per user limit"
              type="number"
              fullWidth
              error={Boolean(errors.limitPerUser)}
              helperText={errors.limitPerUser?.message}
              inputProps={{ min: 0 }}
              {...register("limitPerUser")}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Start date"
              type="date"
              fullWidth
              error={Boolean(errors.start)}
              helperText={errors.start?.message}
              InputLabelProps={{ shrink: true }}
              {...register("start")}
            />
            <TextField
              label="End date"
              type="date"
              fullWidth
              error={Boolean(errors.end)}
              helperText={errors.end?.message}
              InputLabelProps={{ shrink: true }}
              {...register("end")}
            />
          </Stack>
          {mode === "create" ? (
            <FormControlLabel
              control={<Checkbox defaultChecked {...register("active")} />}
              label="Active"
            />
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
