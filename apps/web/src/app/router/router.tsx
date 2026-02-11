import { createBrowserRouter, Navigate } from "react-router-dom";
import { AnalyticsPromoCodesPage } from "../../features/analytics/pages/AnalyticsPromoCodesPage";
import { AnalyticsUsagePage } from "../../features/analytics/pages/AnalyticsUsagePage";
import { AnalyticsUsersPage } from "../../features/analytics/pages/AnalyticsUsersPage";
import { LoginPage } from "../../pages/LoginPage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { OrdersPage } from "../../pages/OrdersPage";
import { PromoCodesPage } from "../../pages/PromoCodesPage";
import { RegisterPage } from "../../pages/RegisterPage";
import { UsersPage } from "../../pages/UsersPage";
import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/users" replace /> },
          { path: "/users", element: <UsersPage /> },
          { path: "/promo-codes", element: <PromoCodesPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/analytics/users", element: <AnalyticsUsersPage /> },
          { path: "/analytics/promo-codes", element: <AnalyticsPromoCodesPage /> },
          { path: "/analytics/usage", element: <AnalyticsUsagePage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
