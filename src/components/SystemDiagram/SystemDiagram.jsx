"use client";

import { useState } from "react";
import "./system-diagram.css";

/**
 * SEASMP arxitektura sxemasi. Tinch holatda juda sekin oqadi (pure CSS
 * @keyframes — JS'siz ham ishlaydi). Tugunga hover qilinganda shu tugunga
 * ulangan yo'llar yoritiladi va tezroq oqadi — bu qism sichqoncha
 * hodisalariga bog'liq, JS bo'lmasa shunchaki ishga tushmaydi (xavfsiz
 * progressiv yaxshilanish — Magnetic bilan bir xil tamoyil).
 */

const NODES = [
  { id: "nextjs", label: "NEXT.JS", x: 220, y: 30, w: 146 },
  { id: "fastify", label: "FASTIFY API", x: 220, y: 130, w: 160 },
  { id: "fastapi", label: "FASTAPI", x: 104, y: 245, w: 148 },
  { id: "postgres", label: "POSTGRESQL", x: 336, y: 245, w: 148 },
  { id: "redis", label: "REDIS", x: 220, y: 365, w: 130 },
];

const EDGES = [
  { id: "e1", from: "nextjs", to: "fastify", d: "M220 58V102", delay: 0 },
  { id: "e2", from: "fastify", to: "fastapi", d: "M220 158V188H104V217", delay: 0.6 },
  { id: "e3", from: "fastify", to: "postgres", d: "M220 158V188H336V217", delay: 1.1 },
  { id: "e4", from: "fastify", to: "redis", d: "M220 158V337", delay: 1.6 },
  { id: "e5", from: "fastapi", to: "postgres", d: "M178 245H262", delay: 2.1 },
];

const NOTES = {
  nextjs: { name: "Interface", text: "Role-specific dashboards for students, teachers and administrators." },
  fastify: { name: "Application core", text: "Routes, validation and access checks. The boundary between the interface and application data." },
  fastapi: { name: "Analytics service", text: "Python analytics behind an internal HTTP contract, separate from the core API." },
  postgres: { name: "Relational data", text: "Application records modeled with Prisma and stored in PostgreSQL." },
  redis: { name: "Short-lived state", text: "Expiring attendance tokens and infrastructure for scheduled analytics tasks." },
};

export default function SystemDiagram() {
  const [hot, setHot] = useState(null);
  const [selected, setSelected] = useState("fastify");
  const active = hot || selected;
  const edgeIsHot = (e) => e.from === active || e.to === active;

  return (
    <div className="sysdia">
      <svg
        viewBox="0 0 440 420"
        className="sysdia__svg"
        role="img"
        aria-labelledby="architecture-title architecture-desc"
      >
        <title id="architecture-title">SEASMP service schematic</title>
        <desc id="architecture-desc">
          Next.js calls the Fastify core API. Fastify calls FastAPI analytics
          over HTTP and uses PostgreSQL and Redis. The Python analytics service
          also reads PostgreSQL.
        </desc>

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

        <g>
          {NODES.map((n) => (
            <g
              key={n.id}
              className={`sysdia__node ${active === n.id ? "is-hot" : ""}`}
              onMouseEnter={() => setHot(n.id)}
              onMouseLeave={() => setHot(null)}
            >
              <rect
                className="sysdia__box"
                x={n.x - n.w / 2}
                y={n.y - 28}
                width={n.w}
                height="56"
                rx="6"
              />
              <text
                className="sysdia__label"
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {n.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <div className="sysdia__controls" aria-label="Explore the architecture">
        {NODES.map((n) => (
          <button type="button" key={n.id} aria-pressed={selected === n.id}
            onClick={() => setSelected(n.id)} aria-controls="architecture-note">
            {n.label.replace(" API", "")}
          </button>
        ))}
      </div>
      <div className="sysdia__note" id="architecture-note" aria-live="polite" aria-atomic="true">
        <span className="mono">{NOTES[selected].name}</span>
        <p>{NOTES[selected].text}</p>
      </div>
    </div>
  );
}
