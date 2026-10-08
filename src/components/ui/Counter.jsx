"use client";

import { useEffect, useState } from "react";
import useInView from "./useInView";

/** Ekranga kirganda 0 dan `to` gacha sanaydi. */
export default function Counter({ to, duration = 1400, suffix = "", prefix = "" }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || to === 0) {
      setN(to);
      return;
    }

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
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="counter">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}
