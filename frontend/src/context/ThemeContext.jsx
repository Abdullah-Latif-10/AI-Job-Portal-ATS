import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getStoredTheme, saveTheme, applyThemeClass } from "../lib/theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const userId = user?._id || null;

  const [theme, setThemeState] = useState(() => getStoredTheme(userId));

  const setTheme = useCallback(
    (nextTheme) => {
      if (nextTheme !== "light" && nextTheme !== "dark") return;
      setThemeState(nextTheme);
      applyThemeClass(nextTheme);
      saveTheme(nextTheme, userId);
    },
    [userId]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  useEffect(() => {
    const stored = getStoredTheme(userId);
    setThemeState(stored);
    applyThemeClass(stored);
  }, [userId]);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
