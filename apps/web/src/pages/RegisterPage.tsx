import { Box, Button, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import type { CreateUserDto, CreateUserIdentityModel } from "../api/source/Api";
import { normalizeErrorMessage } from "../api/httpError";
import { login, register } from "../features/auth/api";
import { useAuth } from "../features/auth/useAuth";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  phone: z.string().min(1, "Phone is required"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload: CreateUserDto = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      await register(payload);
      const loginPayload: CreateUserIdentityModel = {
        email: values.email,
        password: values.password,
      };
      await login(loginPayload);
      await refreshUser();
      navigate("/analytics/users");
    } catch (error) {
      enqueueSnackbar(normalizeErrorMessage(error, "Registration failed"), {
        variant: "error",
      });
    }
  });

  return (
    <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box component="form" onSubmit={onSubmit} sx={{ width: "100%", maxWidth: 420 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...registerField("name")}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...registerField("email")}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...registerField("password")}
        />
        <TextField
          label="Phone"
          fullWidth
          margin="normal"
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
          {...registerField("phone")}
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Create account
        </Button>
      </Box>
    </Box>
  );
}
