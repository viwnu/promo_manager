import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { onUnauthorized } from "../../api/apiClient";
import { useAuthStore } from "../../features/auth/store";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    onUnauthorized(() => {
      useAuthStore.getState().setUnauthenticated();
      navigate("/login");
    });
    return () => onUnauthorized(null);
  }, [navigate]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
