"use client";

import { useRef } from "react";

/** Sichqoncha yaqinlashganda elementni ozgina o'ziga tortadi. */
export default function Magnetic({ children, strength = 0.32, className = "" }) {
  const ref = useRef(null);
  const raf = useRef(0);

  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e) => {
    const el = ref.current;
    if (!el || !canHover()) return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;

    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </span>
  );
}
