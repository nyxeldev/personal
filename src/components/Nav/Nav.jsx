"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X, Search } from "lucide-react";
import usePlatformKey from "@/hooks/usePlatformKey";
import Magnetic from "@/components/ui/Magnetic";
import { SITE } from "@/lib/site";
import { trapDialogTab } from "@/lib/dialogFocus";
import useLanguage, { LANGUAGES } from "@/hooks/useLanguage";
import "./nav.css";

const LINK_IDS = ["work", "data", "decisions", "build", "experience", "about", "contact"];
export default function Nav() {
  const { modKey } = usePlatformKey();
  const { lang, setLang, t } = useLanguage();
  const LINKS = LINK_IDS.map((id) => ({ id, label: t(`nav.links.${id}`) }));
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
        <div className="nav__inner">
          <a href="#top" className="nav__mark" aria-label={t("nav.home")}>
            <span className="nav__mark-glyph" aria-hidden="true">NX</span>
            <span className="nav__mark-text">NYXELDEV</span>
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
              <Search size={13} strokeWidth={2} aria-hidden="true" />
              <span className="nav__cmdk-key">{modKey} K</span>
            </button>
            <div className="nav__lang" role="group" aria-label={t("nav.language")}>
              {LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`nav__lang-btn ${lang === code ? "is-active" : ""}`}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <Magnetic strength={0.2}>
              <a
                className="btn btn--primary btn--sm nav__resume-link"
                href="/files/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("nav.resume")}
                <ArrowUpRight size={14} />
              </a>
            </Magnetic>
            <button
              type="button"
              ref={burgerRef}
              className="nav__burger"
              onClick={() => setOpen(true)}
              aria-label={t("nav.openMenu")}
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
            {t("nav.sheetTitle")}
          </span>
          <button
            type="button"
            className="sheet__close"
            onClick={() => setOpen(false)}
            aria-label={t("nav.closeMenu")}
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
            className="sheet__resume btn btn--primary"
            href="/files/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            {t("nav.resume")}
            <ArrowUpRight size={16} />
          </a>
          <a className="sheet__email" href={`mailto:${SITE.email}`}>
            {t("nav.emailMe")}
          </a>
          <div className="sheet__lang" role="group" aria-label={t("nav.language")}>
            {LANGUAGES.map((code) => (
              <button
                key={code}
                type="button"
                className={`sheet__lang-btn ${lang === code ? "is-active" : ""}`}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
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
