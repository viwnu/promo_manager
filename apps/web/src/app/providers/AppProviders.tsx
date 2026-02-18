import type { PropsWithChildren } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { AuthBootstrap } from "../../features/auth/AuthBootstrap";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6b7280",
      contrastText: "#f9fafb",
    },
    secondary: {
      main: "#9ca3af",
    },
    background: {
      default: "#f3f4f6",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#4b5563",
    },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthBootstrap />
          {children}
        </ThemeProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
