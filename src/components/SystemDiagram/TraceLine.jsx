"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Faol tugunga mos sintetik log qatorini "typewriter" effekti bilan
 * ko'rsatadi — diagrammaga "jonli tizim" hissini qo'shadi. Qatorlar
 * namunaviy (SEASMP'ning haqiqiy formatiga mos, lekin jonli trafik emas).
 */

const TRACE_LINES = {
  nextjs: [
    "GET /dashboard/teacher 200 · 38ms",
    "GET /dashboard/student 200 · 41ms",
  ],
  fastify: [
    "POST /api/attendance 201 · 42ms",
    "GET /api/courses/142 200 · 19ms",
  ],
  fastapi: [
    "POST /analytics/score 200 · 118ms",
    "GET /analytics/risk/142 200 · 64ms",
  ],
  postgres: [
    "SELECT * FROM enrollments WHERE course_id=142 · 6ms",
    "INSERT INTO attendance_records · 4ms",
  ],
  redis: [
    "SET qr:lesson:142 EX 300 · 1ms",
    "DEL qr:lesson:142 · 1ms",
  ],
};

export default function TraceLine({ nodeId }) {
  // Boshlang'ich render har doim to'liq (birinchi) qatorni ko'rsatadi — SSR
  // va JS'siz holat uchun ham tarkib bo'sh qolmaydi. Faqat mount'dan keyin,
  // faol tugun o'zgarganda, typewriter animatsiyasi ishga tushadi.
  const [text, setText] = useState(TRACE_LINES[nodeId]?.[0] ?? "");
  const indexRef = useRef(1);
  const mountedRef = useRef(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return undefined;
    }
    const lines = TRACE_LINES[nodeId];
    if (!lines || !lines.length) return undefined;
    const line = lines[indexRef.current % lines.length];
    indexRef.current += 1;

    if (reducedRef.current) {
      setText(line);
      return undefined;
    }

    setText("");
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setText(line.slice(0, i));
      if (i >= line.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [nodeId]);

  return (
    <div
      className="sysdia__trace mono"
      aria-live="polite"
      title="Illustrative sample trace, not live traffic"
    >
      <span className="sysdia__trace-prompt">
        $ tail -f {nodeId}.log <span className="sysdia__trace-tag">· sample</span>
      </span>
      <span className="sysdia__trace-line">
        {text}
        <span className="sysdia__trace-cursor" aria-hidden="true" />
      </span>
    </div>
  );
}
