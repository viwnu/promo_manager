import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { onUnauthorized } from "../../api/apiClient";
import { useAuth } from "../../features/auth/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, setUnauthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    onUnauthorized(() => {
      setUnauthenticated();
      navigate("/login");
    });
    return () => onUnauthorized(null);
  }, [navigate, setUnauthenticated]);

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
