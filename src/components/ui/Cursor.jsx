"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TARGET_SELECTOR =
  "a, button, input, textarea, select, [role='button'], .magnetic";

const MAX_RIPPLES = 6;

/** Sayt palitrasidan (accent/accent-line/accent-wash) foydalanadigan
 * kursor. Sichqoncha + aniq ko'rsatkichli qurilmalarda uch qatlamli
 * dot/ring/glow — dot (aniq joy), ring (tez lag), glow (sekin lag),
 * shu orqali chuqurlik hissi. Sensorli (coarse pointer) qurilmalarda
 * esa boshqacha: doimiy ergashuvchi kursor o'rniga har bir teginishda
 * o'sha nuqtadan kengayib so'nuvchi nur to'lqini (ripple) — barmoq
 * pozitsiyasini doimiy ko'rsatish "hover"siz ma'nosiz bo'lgani uchun.
 * Reduced-motion'da ikkalasi ham umuman render qilinmaydi; "cursor-active"
 * klassi faqat pointer-rejimda va faqat komponent muvaffaqiyatli ishga
 * tushgandagina qo'shiladi, shuning uchun JS ishlamay qolsa ham asl
 * kursor/teginish xatti-harakati hech qachon buzilmaydi. */
export default function Cursor() {
  const [mode, setMode] = useState("off");
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const raf = useRef(0);
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);

  useEffect(() => {
    const hoverFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (reduced.matches) {
        setMode("off");
      } else if (hoverFine.matches) {
        setMode("pointer");
      } else if (coarse.matches) {
        setMode("touch");
      } else {
        setMode("off");
      }
    };
    sync();
    hoverFine.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      hoverFine.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (mode !== "pointer") return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;

    const move = (e) => {
      const { clientX: x, clientY: y } = e;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const t = `translate3d(${x}px, ${y}px, 0) scale(var(--cursor-scale, 1))`;
        dot.style.transform = t;
        ring.style.transform = t;
        glow.style.transform = t;
      });
    };

    const over = (e) => {
      document.body.classList.toggle(
        "cursor-hover",
        !!e.target.closest?.(TARGET_SELECTOR),
      );
    };

    const press = () => {
      ring.style.setProperty("--cursor-scale", "0.85");
      dot.style.setProperty("--cursor-scale", "0.85");
    };
    const release = () => {
      ring.style.setProperty("--cursor-scale", "1");
      dot.style.setProperty("--cursor-scale", "1");
    };
    const leave = () => document.body.classList.add("cursor-hidden");
    const enter = () => document.body.classList.remove("cursor-hidden");

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mousedown", press);
    document.addEventListener("mouseup", release);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    document.body.classList.add("cursor-active");

    return () => {
      cancelAnimationFrame(raf.current);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mousedown", press);
      document.removeEventListener("mouseup", release);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.body.classList.remove(
        "cursor-active",
        "cursor-hover",
        "cursor-hidden",
      );
    };
  }, [mode]);

  const removeRipple = useCallback((id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  useEffect(() => {
    if (mode !== "touch") return;

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const id = rippleId.current++;
      setRipples((prev) => [
        ...prev.slice(-(MAX_RIPPLES - 1)),
        { id, x: touch.clientX, y: touch.clientY },
      ]);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      setRipples([]);
    };
  }, [mode]);

  if (mode === "pointer") {
    return (
      <>
        <span ref={glowRef} className="cursor__glow" aria-hidden="true" />
        <span ref={ringRef} className="cursor__ring" aria-hidden="true" />
        <span ref={dotRef} className="cursor__dot" aria-hidden="true" />
      </>
    );
  }

  if (mode === "touch") {
    return (
      <>
        {ripples.map((r) => (
          <span
            key={r.id}
            className="cursor__ripple"
            style={{ left: r.x, top: r.y }}
            onAnimationEnd={() => removeRipple(r.id)}
            aria-hidden="true"
          />
        ))}
      </>
    );
  }

  return null;
}
