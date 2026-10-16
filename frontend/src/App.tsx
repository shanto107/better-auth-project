import { Route, Routes } from "react-router";
import LoginPage from "./pages/login-page";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./pages/home-page";
import ResetPasswordPage from "./pages/reset-password-page";
import ProfilePage from "./pages/profile-page";
import TwoFactorPage from "./pages/two-factor-page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth/2fa" element={<TwoFactorPage />} />
      </Routes>

      <Toaster position="top-center" />
    </>
  );
}

export default App;
