import Navbar from "./components/Navbar.jsx";
import LandingHomePage from "./pages/LandingHomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminUserProfile from "./pages/AdminUserProfile.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthenticationStore } from "./store/useAuthenticationStore.js";
import { useDaiseyUiThemeStore } from "./store/useDaiseyUiThemeStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";

function App() {
  // Get the current authentication status and method to verify auth state.
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } =
    useAuthenticationStore();
  const { theme } = useDaiseyUiThemeStore();

  console.log({ onlineUsers });

  // Run authentication check once on component mount.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  // Display a loader until the auth check is complete.
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        {/* Protect routes by redirecting based on auth status. */}
        <Route
          path="/"
          element={authUser ? <LandingHomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/login"
          element={!authUser ? <AdminLoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/admin/user/:id" element={<AdminUserProfile />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Footer />

      <Toaster />
    </div>
  );
}

export default App;
