import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

const drawerWidth = 240;

const navItems = [
  { label: "Users", to: "/users" },
  { label: "Promo Codes", to: "/promo-codes" },
  { label: "Orders", to: "/orders" },
  { label: "Analytics / Users", to: "/analytics/users" },
  { label: "Analytics / Promo Codes", to: "/analytics/promo-codes" },
  { label: "Analytics / Usage", to: "/analytics/usage" },
];

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography variant="h6" component="div">
              Promo Manager
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              selected={isActive}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );})}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflowX: "hidden",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
