"use client";

import { useRef, useState } from "react";
import "./system-diagram.css";

/**
 * Jonli tizim vizualizatsiyasi — real stack asosida.
 * Tinch holatda juda sekin oqadi; hover qilinganda arxitektura "jonlanadi".
 */

const NODES = [
  { id: "data", label: "DATA", kind: "source", x: 172, y: 21, w: 96, h: 34 },
  { id: "python", label: "PYTHON", kind: "core", x: 148, y: 119, w: 144, h: 58 },
  { id: "postgres", label: "POSTGRESQL", kind: "leaf", x: 28, y: 271, w: 160, h: 58 },
  { id: "fastapi", label: "FASTAPI", kind: "leaf", x: 252, y: 271, w: 160, h: 58 },
  { id: "system", label: "SYSTEM", kind: "out", x: 156, y: 426, w: 128, h: 52 },
];

// pathLength="100" — barcha yo'llar bir xil tezlikda oqishi uchun
const EDGES = [
  { id: "e1", d: "M220 55 V119", from: "data", to: "python", delay: 0 },
  { id: "e2", d: "M220 177 V222", from: "python", to: "python", delay: 0.5 },
  { id: "e3", d: "M108 222 H332", from: "python", to: "python", delay: 0.9 },
  { id: "e4", d: "M108 222 V271", from: "python", to: "postgres", delay: 1.3 },
  { id: "e5", d: "M332 222 V271", from: "python", to: "fastapi", delay: 1.3 },
  { id: "e6", d: "M108 329 V378", from: "postgres", to: "system", delay: 1.9 },
  { id: "e7", d: "M332 329 V378", from: "fastapi", to: "system", delay: 1.9 },
  { id: "e8", d: "M108 378 H332", from: "system", to: "system", delay: 2.4 },
  { id: "e9", d: "M220 378 V426", from: "system", to: "system", delay: 2.8 },
];

export default function SystemDiagram() {
  const [hot, setHot] = useState(null);
  const box = useRef(null);
  const raf = useRef(0);

  const edgeIsHot = (e) => hot && (e.from === hot || e.to === hot);

  // kursorga sezilar-sezilmas ergashadi — chuqurlik hissi uchun
  const onMove = (e) => {
    const el = box.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);

    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--px", `${(dx * 7).toFixed(2)}px`);
      el.style.setProperty("--py", `${(dy * 7).toFixed(2)}px`);
    });
  };

  const onLeave = () => {
    const el = box.current;
    cancelAnimationFrame(raf.current);
    setHot(null);
    if (el) {
      el.style.setProperty("--px", "0px");
      el.style.setProperty("--py", "0px");
    }
  };

  return (
    <div
      ref={box}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="sysdia"
      role="img"
      aria-label="System architecture: data flows into Python, which writes to PostgreSQL and serves FastAPI, together forming the running system."
    >
      <svg viewBox="0 0 440 500" className="sysdia__svg" aria-hidden="true">
        {/* chiziqlar */}
        <g className="sysdia__edges">
          {EDGES.map((e) => (
            <g key={e.id} className={edgeIsHot(e) ? "is-hot" : ""}>
              <path className="sysdia__wire" d={e.d} pathLength="100" />
              <path
                className="sysdia__flow"
                d={e.d}
                pathLength="100"
                style={{ animationDelay: `${e.delay}s` }}
              />
            </g>
          ))}
        </g>

        {/* tugunlar */}
        <g className="sysdia__nodes">
          {NODES.map((n) => (
            <g
              key={n.id}
              className={`sysdia__node sysdia__node--${n.kind} ${hot === n.id ? "is-hot" : ""}`}
              onMouseEnter={() => setHot(n.id)}
              onMouseLeave={() => setHot(null)}
            >
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx="6"
                className="sysdia__box"
              />
              <text
                x={n.x + n.w / 2}
                y={n.y + n.h / 2}
                className="sysdia__label"
                dominantBaseline="central"
                textAnchor="middle"
              >
                {n.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
