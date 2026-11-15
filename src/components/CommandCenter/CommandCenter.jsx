"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import usePlatformKey from "@/hooks/usePlatformKey";
import { SITE } from "@/lib/site";
import { trapDialogTab } from "@/lib/dialogFocus";
import useLanguage from "@/hooks/useLanguage";
import "./command-center.css";

const fold = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function CommandCenter() {
  const { modKey } = usePlatformKey();
  const { t } = useLanguage();
  const items_i18n = t("commandCenter.items");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const restoreTo = useRef(null);
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);
  const go = useCallback(
    (id) => {
      close();
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
        el.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
        history.replaceState(null, "", `#${id}`);
      });
    },
    [close],
  );
  const openUrl = useCallback(
    (url) => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [close],
  );
  const items = useMemo(
    () => [
      ...["work", "data", "decisions", "build", "experience", "about", "contact"].map(
        (id) => ({
          id,
          label: items_i18n[id],
          keywords: "sections",
          run: () => go(id),
        }),
      ),
      {
        id: "seasmp",
        label: items_i18n.seasmp,
        keywords: "project education analytics",
        run: () => go("seasmp"),
      },
      {
        id: "ielts",
        label: items_i18n.ielts,
        keywords: "project speaking",
        run: () => openUrl("https://speakready.netlify.app"),
      },
      {
        id: "resume",
        label: items_i18n.resume,
        keywords: "resume cv pdf",
        run: () => openUrl("/files/Resume.pdf"),
      },
      {
        id: "github",
        label: items_i18n.github,
        keywords: "code source",
        run: () => openUrl(SITE.github),
      },
      {
        id: "linkedin",
        label: items_i18n.linkedin,
        keywords: "profile",
        run: () => openUrl(SITE.linkedin),
      },
      {
        id: "email",
        label: `${items_i18n.email} ${SITE.email}`,
        keywords: "contact mail",
        run: () => {
          close();
          window.location.href = `mailto:${SITE.email}`;
        },
      },
    ],
    [go, openUrl, close, items_i18n],
  );
  const results = useMemo(
    () =>
      items.filter((it) =>
        fold(`${it.label} ${it.keywords}`).includes(fold(query.trim())),
      ),
    [items, query],
  );
  useEffect(() => {
    const requestOpen = () => {
      if (document.querySelector(".sheet[open]")) return;
      restoreTo.current = document.activeElement;
      setQuery("");
      setCursor(0);
      setOpen(true);
    };
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else requestOpen();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("cmdk:open", requestOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", requestOpen);
    };
  }, [open, close]);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      restoreTo.current?.focus?.();
    };
  }, [open]);
  useEffect(() => {
    if (open)
      document
        .getElementById(`command-${results[cursor]?.id}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, cursor, results]);
  const navigate = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) =>
        results.length
          ? (c + (e.key === "ArrowDown" ? 1 : -1) + results.length) %
            results.length
          : 0,
      );
    }
    if (e.key === "Home" && e.altKey) {
      e.preventDefault();
      setCursor(0);
    }
    if (e.key === "End" && e.altKey) {
      e.preventDefault();
      setCursor(Math.max(0, results.length - 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      results[cursor]?.run();
    }
  };
  return (
    <dialog
      ref={dialogRef}
      className="cmdk"
      aria-label="Command centre"
      onKeyDown={trapDialogTab}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="cmdk__panel">
        <div className="cmdk__search">
          <input
            ref={inputRef}
            className="cmdk__input"
            placeholder={t("commandCenter.placeholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={navigate}
            role="combobox"
            aria-label="Search commands"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls="command-results"
            aria-activedescendant={
              open && results[cursor]
                ? `command-${results[cursor].id}`
                : undefined
            }
            autoComplete="off"
            spellCheck="false"
          />
          <button
            className="cmdk__close"
            onClick={close}
            type="button"
            aria-label={t("commandCenter.close")}
          >
            <X size={18} />
          </button>
        </div>
        <div
          id="command-results"
          className="cmdk__list"
          role="listbox"
          aria-label="Commands"
        >
          {results.map((it, i) => (
            <div
              id={`command-${it.id}`}
              key={it.id}
              role="option"
              aria-selected={i === cursor}
              className={`cmdk__item ${i === cursor ? "is-on" : ""}`}
              onMouseEnter={() => setCursor(i)}
              onClick={() => it.run()}
            >
              <span className="cmdk__label">{it.label}</span>
              <ArrowUpRight size={14} />
            </div>
          ))}
        </div>
        <p className="cmdk__empty" role="status">
          {results.length === 0
            ? t("commandCenter.empty")
            : `${results.length} ${t("commandCenter.results")}`}
        </p>
        <div className="cmdk__foot mono">
          ↑ ↓ {t("commandCenter.hint")} {modKey} K
        </div>
      </div>
    </dialog>
  );
}
