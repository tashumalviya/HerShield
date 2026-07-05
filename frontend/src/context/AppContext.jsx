import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  
  const [theme, setTheme] = useState("light");
const savedUser = localStorage.getItem("user");

const [user, setUser] = useState(
  savedUser ? JSON.parse(savedUser) : null
);

const [screen, setScreen] = useState(
  savedUser ? "dashboard" : "login"
);

  const [otpMethod, setOtpMethod] = useState("sms");
  const [onboardingStep, setOnboardingStep] = useState(0);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <AppContext.Provider value={{
      screen, setScreen,
      theme, toggleTheme,
      user, setUser,
      otpMethod, setOtpMethod,
      onboardingStep, setOnboardingStep
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
