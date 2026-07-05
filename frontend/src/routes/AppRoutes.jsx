import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login";
import OtpMethod from "../pages/OtpMethod";
import OtpVerify from "../pages/OtpVerify";
import Onboarding from "../pages/Onboarding";
import Dashboard from "../pages/Dashboard/Dashboard";

export default function AppRoutes() {

  const user = JSON.parse(localStorage.getItem("user"));

  const onboardingDone =
    user?.onboarding_done === 1 ||
    user?.onboarding_done === "1";

  return (
    <Routes>

      <Route
        path="/"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <Signup />
        }
      />

      <Route path="/otp-method" element={<OtpMethod />} />
      <Route path="/otp-verify" element={<OtpVerify />} />

      <Route path="/onboarding" element={<Onboarding />} />

      <Route
        path="/dashboard"
        element={
          user ? (
            onboardingDone ? (
              <Dashboard />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}