import "./App.css";
import { Route, Routes } from "react-router-dom";

import IndexPage from "./pages";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import CheckoutPage from "./pages/checkout";
import RequestChangePasswordPage from "./pages/auth/request-reset-password";
import OrderDetailsPage from "./pages/order-details";

import { ProtectedRoute } from "./pages/auth/protected-route-wrapper";

function App() {
  return (
    <Routes>
      {/* ADMIN ONLY */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin", "sales", "accounting", "logistics"]}
          />
        }
      >
        <Route path="/:tab/:pageNumber" element={<IndexPage />} />
        <Route path="/order/details/:orderId" element={<OrderDetailsPage />} />
      </Route>

      {/* ADMIN + AGENT
      <Route element={<ProtectedRoute allowedRoles={["admin", "sa"]} />}>
      </Route> */}

      {/* AGENT ONLY */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      {/* PUBLIC AUTH ROUTES */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/pw/request-change"
        element={<RequestChangePasswordPage />}
      />
    </Routes>
  );
}

export default App;
