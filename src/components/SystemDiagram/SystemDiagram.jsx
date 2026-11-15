"use client";

import { useState, useEffect, Component } from "react";
import dynamic from "next/dynamic";
import TraceLine from "./TraceLine";
import useLanguage from "@/hooks/useLanguage";
import "./system-diagram.css";

/**
 * SEASMP arxitektura sxemasi. Server/no-JS holatida har doim pastdagi
 * oddiy SVG ko'rinadi (zero hydration mismatch). Mount bo'lgach, agar
 * ekran keng (desktop) va WebGL mavjud bo'lsa, xuddi shu grafni 3D
 * holografik sahna bilan almashtiradi. Har qanday muvaffaqiyatsizlikda
 * (xato yoki WebGL yo'q) xavfsiz tarzda SVG'ga qaytadi.
 */

const SystemDiagramScene = dynamic(() => import("./SystemDiagramScene"), {
  ssr: false,
  loading: () => null,
});

class WebGLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail?.();
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

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

export default function SystemDiagram() {
  const { t } = useLanguage();
  const NOTES = t("systemDiagram.notes");
  const [hot, setHot] = useState(null);
  const [selected, setSelected] = useState("fastify");
  const [use3d, setUse3d] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const accent = "#86adff";
  const fogColor = "#0c1525";
  const labelColor = "#dfe8fb";
  const active = hot || selected;
  const edgeIsHot = (e) => e.from === active || e.to === active;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 961px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motion.matches);

    const evaluate = () => setUse3d(desktop.matches && hasWebGL());
    evaluate();

    desktop.addEventListener("change", evaluate);
    motion.addEventListener("change", (e) => setReducedMotion(e.matches));
    return () => desktop.removeEventListener("change", evaluate);
  }, []);

  return (
    <div className="sysdia">
      <div className="sysdia__stage">
        {use3d && (
          <div
            className={`sysdia__canvas-wrap ${sceneReady ? "is-ready" : ""}`}
            aria-hidden="true"
          >
            <WebGLBoundary
              onFail={() => {
                setUse3d(false);
                setSceneReady(false);
              }}
            >
              <SystemDiagramScene
                hot={hot}
                selected={selected}
                onHover={setHot}
                onSelect={setSelected}
                reducedMotion={reducedMotion}
                accent={accent}
                fogColor={fogColor}
                labelColor={labelColor}
                onReady={() => setSceneReady(true)}
              />
            </WebGLBoundary>
          </div>
        )}

        {!sceneReady && (
          <svg
            viewBox="0 0 440 420"
            className="sysdia__svg"
            role="img"
            aria-labelledby="architecture-title architecture-desc"
          >
            <title id="architecture-title">{t("systemDiagram.svgTitle")}</title>
            <desc id="architecture-desc">{t("systemDiagram.svgDesc")}</desc>

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
        )}
      </div>

      <div className="sysdia__controls" aria-label={t("systemDiagram.exploreLabel")}>
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
      <TraceLine nodeId={active} />
    </div>
  );
}
