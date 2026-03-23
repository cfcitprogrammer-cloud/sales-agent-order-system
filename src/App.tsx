import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "./pages";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import CheckoutPage from "./pages/checkout";
import RequestChangePasswordPage from "./pages/auth/request-reset-password";
import OrderDetailsPage from "./pages/order-details";

import { ProtectedRoute } from "./pages/auth/protected-route-wrapper";
import ResetPasswordPage from "./pages/auth/reset-password";

function App() {
  return (
    <Routes>
      {/* ALL ONLY */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin", "sales", "accounting", "logistic"]}
          />
        }
      >
        <Route path="/:tab/:pageNumber" element={<IndexPage />} />
        <Route path="/:tab/:viewType/:pageNumber" element={<IndexPage />} />
        <Route path="/order/details/:orderId" element={<OrderDetailsPage />} />
      </Route>

      {/* AGENT ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "sales"]} />}>
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      {/* PUBLIC AUTH ROUTES */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/pw/request-change"
        element={<RequestChangePasswordPage />}
      />
      <Route path="/pw/reset" element={<ResetPasswordPage />} />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
