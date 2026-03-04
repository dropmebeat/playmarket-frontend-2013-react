import { createContext } from "react";

export type ThemeMode = "light" | "dark";

export type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
};

export const THEME_STORAGE_KEY = "play_theme_mode";

export const ThemeContext = createContext<ThemeContextValue | null>(null);
