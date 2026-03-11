import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import CheckoutPage from "./pages/checkout";
import RequestChangePasswordPage from "./pages/auth/request-reset-password";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CheckoutPage />} path="/checkout" />

      {/* auth */}
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route
        element={<RequestChangePasswordPage />}
        path="/pw/request-change"
      />
    </Routes>
  );
}

export default App;
