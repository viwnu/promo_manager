import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import type { CreateUserIdentityModel } from "../api/source/Api";
import { normalizeErrorMessage } from "../api/httpError";
import { login } from "../features/auth/api";
import { useAuth } from "../features/auth/useAuth";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
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
      const payload: CreateUserIdentityModel = values;
      await login(payload);
      await refreshUser();
      navigate("/analytics/users");
    } catch (error) {
      enqueueSnackbar(normalizeErrorMessage(error, "Login failed"), {
        variant: "error",
      });
    }
  });

  return (
    <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box component="form" onSubmit={onSubmit} sx={{ width: "100%", maxWidth: 420 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
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
        <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
          <Box sx={{ flex: 1 }} />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Sign in
          </Button>
        </Stack>
        <Stack
          spacing={1}
          alignItems="center"
          sx={{ mt: 3, textAlign: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            Don`t have an account?
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            sx={{ borderWidth: 2 }}
          >
            Sign up
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
