import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ThemeContextValue,
  type ThemeMode,
} from "./themeStore";

function detectInitialTheme(): ThemeMode {
  const stored =
    typeof window !== "undefined"
      ? (window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null)
      : null;
  if (stored === "light" || stored === "dark") return stored;

  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(detectInitialTheme);

  useEffect(() => {
    document.body.dataset.theme = mode;
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === "dark",
      toggleTheme: () =>
        setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
