"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import usePlatformKey from "@/hooks/usePlatformKey";
import Magnetic from "@/components/ui/Magnetic";
import "./nav.css";

const LINKS = [
  { id: "about", num: "01", label: "About" },
  { id: "build", num: "02", label: "Expertise" },
  { id: "work", num: "03", label: "Work" },
  { id: "data", num: "04", label: "Data" },
  { id: "decisions", num: "05", label: "Decisions" },
  { id: "contact", num: "06", label: "Contact" },
];

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { modKey } = usePlatformKey();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const sheetRef = useRef(null);
  const burgerRef = useRef(null);

  // fon chizig'i faqat scroll qilingach chiqadi
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // qaysi bo'lim ko'rinayotganini kuzatadi
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // menyu ochiqda sahifa scroll qilinmasin
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc bilan yopish, Tab menyudan chiqib ketmasin, yopilgach fokus tugmaga qaytsin
  useEffect(() => {
    if (!open) return;

    const sheet = sheetRef.current;
    const focusables = sheet
      ? sheet.querySelectorAll('a[href], button:not([disabled])')
      : [];
    focusables[0]?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      burgerRef.current?.focus();
    };
  }, [open]);

  const isDark = theme === "dark";

  return (
    <>
      <header className={`nav ${stuck ? "is-stuck" : ""}`}>
        <div className="nav__inner shell">
          <a href="#top" className="nav__mark" aria-label="Jahongir Hamidov — home">
            <span className="nav__mark-glyph">JH</span>
            <span className="nav__mark-text">Jahongir Hamidov</span>
          </a>

          <nav className="nav__links" aria-label="Sections">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`nav__link ${active === l.id ? "is-active" : ""}`}
              >
                <span className="nav__link-num">{l.num}</span>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__end">
            <button
              className="nav__cmdk"
              onClick={() => window.dispatchEvent(new CustomEvent("cmdk:open"))}
              aria-label="Open command centre"
            >
              <span className="nav__cmdk-key">{modKey}</span>
              <span className="nav__cmdk-key">K</span>
            </button>

            <Magnetic strength={0.2}>
              <a
                className="nav__resume"
                href="/files/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Résumé
                <ArrowUpRight size={14} strokeWidth={2} />
              </a>
            </Magnetic>

            <button
              className="nav__icon"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
            </button>

            <button
              ref={burgerRef}
              className="nav__burger"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="nav-sheet"
            >
              <span className={`nav__burger-bars ${open ? "is-x" : ""}`} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* mobil menyu — to'liq ekran, shaffof emas */}
      <div
        id="nav-sheet"
        ref={sheetRef}
        className={`sheet ${open ? "is-open" : ""}`}
        inert={!open}
      >
        <nav className="sheet__links" aria-label="Sections">
          {LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="sheet__link"
              style={{ "--i": i }}
              onClick={() => setOpen(false)}
            >
              <span className="sheet__num">{l.num}</span>
              {l.label}
            </a>
          ))}
        </nav>

        <a
          className="sheet__resume"
          href="/files/Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Download résumé
          <ArrowUpRight size={16} strokeWidth={2} />
        </a>
      </div>
    </>
  );
}
