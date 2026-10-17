import { Route, Routes } from "react-router";
import LoginPage from "./pages/login-page";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./pages/home-page";
import ResetPasswordPage from "./pages/reset-password-page";
import ProfilePage from "./pages/profile-page";
import TwoFactorPage from "./pages/two-factor-page";
import AdminPage from "./pages/admin-page";
import { ImpersonationIndicator } from "./components/common/impersonation-indicator";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth/2fa" element={<TwoFactorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      <Toaster position="top-center" />
      <ImpersonationIndicator />
    </>
  );
}

export default App;
