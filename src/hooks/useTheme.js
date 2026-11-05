"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
const ThemeContext = createContext(null);
function applyTheme(theme) {
  document.documentElement.classList.remove("light-theme", "dark-theme");
  document.documentElement.classList.add(`${theme}-theme`);
}
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    let saved = "light";
    try {
      saved = localStorage.getItem("theme") === "dark" ? "dark" : "light";
    } catch {}
    setTheme(saved);
    applyTheme(saved);
  }, []);
  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export default function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside a ThemeProvider");
  return context;
}
