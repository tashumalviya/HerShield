import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import AuthPage from "../pages/AuthPage";
import TrackPage from "../pages/TrackPage";
import Dashboard from "../pages/Dashboard/Dashboard";

function Guard({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  return isSignedIn ? children : <Navigate to="/sign-in" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<AuthPage mode="in" />} />
      <Route path="/sign-up/*" element={<AuthPage mode="up" />} />
      <Route path="/track/:token" element={<TrackPage />} />
      <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
