import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
    </Routes>
  );
}

export default App;
