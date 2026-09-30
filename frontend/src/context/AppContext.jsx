import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const toggleTheme = () =>
    setTheme((t) => {
      const n = t === "light" ? "dark" : "light";
      localStorage.setItem("theme", n);
      return n;
    });
  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
}
