"use client";

import { useEffect, useState } from "react";
import useInView from "./useInView";

/**
 * Ekranga kirganda 0 dan `to` gacha sanaydi.
 * Boshlang'ich render har doim `to` qiymatini ko'rsatadi (SSR/JS'siz holat
 * uchun to'g'ri yakuniy son) — faqat JS hydratsiyadan keyin, ekranga
 * kirganda, hisoblash animatsiyasi bilan almashtiriladi.
 */
export default function Counter({ to, duration = 1400, suffix = "", prefix = "" }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [n, setN] = useState(to);
  const [armed, setArmed] = useState(false);

  // Faqat mount bo'lgach animatsiyaga "qurollanadi" — shu paytgacha
  // yakuniy qiymat ko'rinib turadi, hech qanday "0 dan boshlanish" yoki
  // bo'sh holat ko'rsatilmaydi.
  useEffect(() => {
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || !inView) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || to === 0) {
      setN(to);
      return;
    }

    setN(0);
    let frame = 0;
    const t0 = performance.now();

    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      // easeOutExpo — oxiriga borib sekinlashadi
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(to * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, inView, to, duration]);

  return (
    <span ref={ref} className="counter">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}
