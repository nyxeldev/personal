"use client";

import { useEffect, useRef } from "react";

// siljish uchun zaxira beradigan kattalashtirish
const SCALE = 1.18;

/**
 * Element ekran bo'ylab o'tganda ichidagi rasmni sekin siljitadi.
 * `amount` — piksellarda to'liq yurish masofasi.
 */
export default function Parallax({ amount = 28, className = "", children }) {
  const frame = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    const box = frame.current;
    const el = inner.current;
    if (!box || !el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;

      // -1 (pastda) … 1 (tepada)
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);

      // kattalashtirishdan hosil bo'lgan zaxiradan oshib ketmaslik kerak,
      // aks holda kichik ekranda ramka chetida bo'shliq ko'rinadi
      const headroom = (el.offsetHeight * (SCALE - 1)) / 2;
      const shift = progress * Math.min(amount, headroom);

      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(${SCALE})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [amount]);

  return (
    <span ref={frame} className={`plx ${className}`.trim()}>
      <span ref={inner} className="plx__in">
        {children}
      </span>
    </span>
  );
}
