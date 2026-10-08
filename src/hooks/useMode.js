"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Saytning ikki o'qish rejimi.
 *  recruiter — qisqa: kim, nima qilgan, qanday bog'lanish
 *  engineer  — chuqur: arxitektura, qarorlar, testlar, CI
 *
 * Rejim <html> ustidagi class orqali ishlaydi va CSS'da display:none bilan
 * yopiladi — shunda yashirilgan blok Tab tartibida ham, skrinriderda ham
 * qolmaydi (visibility yoki opacity bunday qilmaydi).
 */

const ModeContext = createContext(null);

const MODE_CLASSES = ["mode-recruiter", "mode-engineer"];

export const MODES = [
  { id: "recruiter", label: "Recruiter" },
  { id: "engineer", label: "Engineer" },
];

function applyMode(mode) {
  document.documentElement.classList.remove(...MODE_CLASSES);
  document.documentElement.classList.add(`mode-${mode}`);
}

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState("recruiter");

  useEffect(() => {
    let saved = "recruiter";
    try {
      saved = localStorage.getItem("mode") || "recruiter";
    } catch {
      // private rejimda localStorage yo'q bo'lishi mumkin
    }
    setModeState(saved);
    applyMode(saved);
  }, []);

  const setMode = (next) => {
    if (next !== "recruiter" && next !== "engineer") return;
    setModeState(next);
    applyMode(next);
    try {
      localStorage.setItem("mode", next);
    } catch {
      // saqlanmasa ham rejim shu sessiyada ishlaydi
    }
  };

  const toggleMode = () => setMode(mode === "recruiter" ? "engineer" : "recruiter");

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export default function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used inside a ModeProvider");
  }
  return context;
}
