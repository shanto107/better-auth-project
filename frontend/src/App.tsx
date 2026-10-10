import { Route, Routes } from "react-router";
import LoginPage from "./pages/login-page";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./pages/home-page";
import ResetPasswordPage from "./pages/reset-password-page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      </Routes>

      <Toaster position="top-center" />
    </>
  );
}

export default App;
