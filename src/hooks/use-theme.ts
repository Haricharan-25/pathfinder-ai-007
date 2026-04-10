import { useEffect } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "pathfinder-theme";

export function useTheme() {
  const getTheme = (): Theme => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const setTheme = (theme: Theme) => {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  const toggle = () => {
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(current === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const theme = getTheme();
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return { toggle, isDark: typeof document !== "undefined" && document.documentElement.classList.contains("dark") };
}
