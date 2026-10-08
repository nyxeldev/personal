"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Moon,
  Send,
  Sun,
  Hash,
  Boxes,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";
import usePlatformKey from "@/hooks/usePlatformKey";
import "./command-center.css";

export default function CommandCenter() {
  const { theme, toggleTheme } = useTheme();

  const { modKey } = usePlatformKey();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const restoreTo = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const go = useCallback(
    (hash) => {
      close();
      // modal yopilib, fokus qaytganidan keyin suramiz
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    },
    [close]
  );

  const openUrl = useCallback(
    (url) => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [close]
  );

  const items = useMemo(
    () => [
      // --- bo'limlar ---
      { id: "s-about", group: "Jump to", label: "Who I am", icon: Hash, keywords: "about bio intro", run: () => go("about") },
      { id: "s-build", group: "Jump to", label: "Expertise", icon: Hash, keywords: "skills stack tech", run: () => go("build") },
      { id: "s-work", group: "Jump to", label: "Selected work", icon: Hash, keywords: "projects case study seasmp", run: () => go("work") },
      { id: "s-data", group: "Jump to", label: "Data engineering", icon: Hash, keywords: "logistics payout amazon relay", run: () => go("data") },
      { id: "s-decisions", group: "Jump to", label: "Engineering decisions", icon: Hash, keywords: "why reasoning tradeoffs", run: () => go("decisions") },
      { id: "s-contact", group: "Jump to", label: "Contact", icon: Hash, keywords: "email message hire", run: () => go("contact") },

      // --- loyihalar ---
      {
        id: "p-seasmp",
        group: "Projects",
        label: "SEASMP — source on GitHub",
        icon: Boxes,
        keywords: "education analytics fastify fastapi postgres repo",
        run: () => openUrl("https://github.com/nyxeldev/seasmp"),
      },
      {
        id: "p-ielts",
        group: "Projects",
        label: "IELTS Speaking Practice — live demo",
        icon: Boxes,
        keywords: "speaking ielts nextjs demo",
        run: () => openUrl("https://speakready.netlify.app"),
      },

      // --- amallar ---
      {
        id: "a-resume",
        group: "Actions",
        label: "Download résumé",
        icon: Download,
        keywords: "resume cv pdf hire download",
        run: () => openUrl("/files/Resume.pdf"),
      },
      { id: "a-github", group: "Actions", label: "GitHub — nyxeldev", icon: Github, keywords: "code repos", run: () => openUrl("https://github.com/nyxeldev") },
      { id: "a-linkedin", group: "Actions", label: "LinkedIn", icon: Linkedin, keywords: "profile", run: () => openUrl("https://www.linkedin.com/in/iamhamidov/") },
      { id: "a-telegram", group: "Actions", label: "Telegram — @nyxeldev", icon: Send, keywords: "chat message", run: () => openUrl("https://t.me/nyxeldev") },
      {
        id: "a-email",
        group: "Actions",
        label: "Email imhamidovic@gmail.com",
        icon: Mail,
        keywords: "mail contact write",
        run: () => {
          close();
          window.location.href = "mailto:imhamidovic@gmail.com";
        },
      },

      // --- sozlamalar ---
      {
        id: "t-theme",
        group: "Preferences",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        icon: theme === "dark" ? Sun : Moon,
        keywords: "theme dark light appearance",
        run: () => {
          toggleTheme();
          close();
        },
      },
    ],
    [theme, go, openUrl, toggleTheme, close]
  );

  // "resume" yozilganda "résumé" ham topilsin
  const fold = (v) =>
    v
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return items;
    return items.filter((it) => fold(`${it.label} ${it.group} ${it.keywords}`).includes(q));
  }, [items, query]);

  // ⌘K / Ctrl+K ochadi
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) restoreTo.current = document.activeElement;
          return !v;
        });
      }
    };
    const onOpen = () => {
      restoreTo.current = document.activeElement;
      setOpen(true);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("cmdk:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", onOpen);
    };
  }, []);

  // ochiqda: fokus, scroll qulfi, klaviatura boshqaruvi
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => (results.length ? (c + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        results[cursor]?.run();
      } else if (e.key === "Tab") {
        // modal ichida qolsin
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus?.();
    };
  }, [open, results, cursor, close]);

  // tanlangan qator ko'rinib tursin
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-i="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor, open]);

  if (!open) return null;

  let lastGroup = null;

  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command centre">
      <button className="cmdk__scrim" aria-label="Close" onClick={close} tabIndex={-1} />

      <div className="cmdk__panel">
        <div className="cmdk__search">
          <input
            ref={inputRef}
            className="cmdk__input"
            placeholder="Search sections, projects, actions…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            aria-label="Search"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="cmdk__esc">esc</kbd>
        </div>

        <div className="cmdk__list" ref={listRef} role="listbox" aria-label="Results">
          {results.length === 0 && <p className="cmdk__empty">Nothing matches that.</p>}

          {results.map((it, i) => {
            const Icon = it.icon;
            const head = it.group !== lastGroup ? it.group : null;
            lastGroup = it.group;

            return (
              <div key={it.id}>
                {head && <div className="cmdk__group mono">{head}</div>}
                <button
                  type="button"
                  data-i={i}
                  role="option"
                  aria-selected={i === cursor}
                  className={`cmdk__item ${i === cursor ? "is-on" : ""}`}
                  onMouseMove={() => setCursor(i)}
                  onClick={() => it.run()}
                  tabIndex={-1}
                >
                  <Icon size={15} strokeWidth={1.7} className="cmdk__icon" />
                  <span className="cmdk__label">{it.label}</span>
                  <ArrowUpRight size={14} strokeWidth={1.7} className="cmdk__go" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="cmdk__foot mono">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>{modKey}</kbd>
            <kbd>K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}
