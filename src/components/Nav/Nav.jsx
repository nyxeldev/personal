"use client";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun, ArrowUpRight, X } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import usePlatformKey from "@/hooks/usePlatformKey";
import Magnetic from "@/components/ui/Magnetic";
import { SITE } from "@/lib/site";
import { trapDialogTab } from "@/lib/dialogFocus";
import "./nav.css";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "data", label: "Data" },
  { id: "decisions", label: "Decisions" },
  { id: "build", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { modKey } = usePlatformKey();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const sheetRef = useRef(null);
  const burgerRef = useRef(null);
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const dialog = sheetRef.current;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const resize = () => {
      if (window.innerWidth > 1180) setOpen(false);
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      dialog.close();
      document.body.style.overflow = previous;
      burgerRef.current?.focus();
    };
  }, [open]);
  const jump = (id) => {
    setOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }
    });
  };
  return (
    <>
      <header className={`nav ${stuck ? "is-stuck" : ""}`}>
        <div className="nav__inner shell">
          <a
            href="#top"
            className="nav__mark"
            aria-label="Jahongir Hamidov — home"
          >
            <span className="nav__mark-glyph">JH</span>
            <span className="nav__mark-text">Jahongir Hamidov</span>
          </a>
          <nav className="nav__links" aria-label="Sections">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`nav__link ${active === l.id ? "is-active" : ""}`}
                aria-current={active === l.id ? "location" : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav__end">
            <button
              type="button"
              className="nav__cmdk"
              onClick={() => window.dispatchEvent(new CustomEvent("cmdk:open"))}
              aria-label="Open command centre"
            >
              <span className="nav__cmdk-key">{modKey} K</span>
            </button>
            <Magnetic strength={0.2}>
              <a
                className="nav__resume"
                href="/files/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View résumé
                <ArrowUpRight size={14} />
              </a>
            </Magnetic>
            <button
              type="button"
              className="nav__icon"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              ref={burgerRef}
              className="nav__burger"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="nav-sheet"
            >
              <span className="nav__burger-bars" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>
      <dialog
        id="nav-sheet"
        ref={sheetRef}
        className="sheet"
        aria-labelledby="menu-title"
        onKeyDown={trapDialogTab}
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <div className="sheet__head">
          <span id="menu-title" className="mono">
            Explore the portfolio
          </span>
          <button
            type="button"
            className="sheet__close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="sheet__links" aria-label="Mobile sections">
          {LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="sheet__link"
              onClick={() => jump(l.id)}
            >
              <span className="sheet__num" aria-hidden="true">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="sheet__actions">
          <a
            className="sheet__resume"
            href="/files/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            View résumé
            <ArrowUpRight size={16} />
          </a>
          <a className="sheet__email" href={`mailto:${SITE.email}`}>
            Email Jahongir
          </a>
        </div>
      </dialog>
      <noscript>
        <nav className="nojs-nav" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`}>
              {l.label}
            </a>
          ))}
        </nav>
      </noscript>
    </>
  );
}
