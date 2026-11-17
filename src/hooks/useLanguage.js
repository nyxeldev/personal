"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { en } from "@/lib/i18n/en";
import { ru } from "@/lib/i18n/ru";
import { uz } from "@/lib/i18n/uz";

const DICTS = { en, ru, uz };
export const LANGUAGES = ["en", "ru", "uz"];

const LanguageContext = createContext(null);

function readPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    let saved = "en";
    try {
      const stored = localStorage.getItem("lang");
      if (LANGUAGES.includes(stored)) saved = stored;
    } catch {}
    setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem("lang", next);
    } catch {}
  }, []);

  const t = useCallback(
    (key) => {
      const value = readPath(DICTS[lang], key);
      if (value !== undefined) return value;
      const fallback = readPath(DICTS.en, key);
      return fallback !== undefined ? fallback : key;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export default function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside a LanguageProvider");
  return context;
}
