"use client";

import { useEffect, useRef, useState } from "react";

const TARGET_SELECTOR =
  "a, button, input, textarea, select, [role='button'], .magnetic";

/** Sayt palitrasidan (accent/accent-line/accent-wash) foydalanadigan
 * kursor — uch qatlam: dot (aniq joy), ring (tez lag), glow (sekin lag),
 * shu orqali chuqurlik hissi beradi. Faqat sichqoncha + aniq ko'rsatkichli
 * qurilmalarda va reduced-motion'siz yoqiladi; aks holda umuman render
 * qilinmaydi va asl kursor hech qachon tegilmaydi (fail-safe: body'ga
 * "cursor-active" klassi faqat shu komponent muvaffaqiyatli ishga
 * tushgandan keyin qo'shiladi, global CSS qoidasi emas). */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    const hoverFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(hoverFine.matches && !reduced.matches);
    sync();
    hoverFine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      hoverFine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
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
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <span ref={glowRef} className="cursor__glow" aria-hidden="true" />
      <span ref={ringRef} className="cursor__ring" aria-hidden="true" />
      <span ref={dotRef} className="cursor__dot" aria-hidden="true" />
    </>
  );
}
