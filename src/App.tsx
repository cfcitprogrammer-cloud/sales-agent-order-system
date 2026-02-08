import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages";
import LoginPage from "./pages/auth/login";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
    </Routes>
  );
}

export default App;
