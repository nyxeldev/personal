"use client";

import { useEffect, useRef, useState } from "react";
import useLanguage from "@/hooks/useLanguage";

/**
 * Uchta xatoni animatsion "replay" sifatida ko'rsatadi: har bosqich o'z
 * vizuali + jonli raqami bilan, pastdagi uchta fault kartasini active
 * holatga sinxronlaydi. Ko'rinmay qolsa (IntersectionObserver) yoki
 * prefers-reduced-motion bo'lsa, avtomatik aylanish to'xtaydi — faqat
 * qo'lda (dots) boshqariladi.
 */

const STEP_MS = 3600;

function LedgerVisual({ ledger }) {
  return (
    <div className="replay__ledger">
      {ledger.rows.map((row, i) => (
        <div
          className={`replay__row ${i === 2 ? "replay__row--total" : ""} ${i === 3 ? "replay__row--sum" : ""}`}
          key={row.label}
        >
          <span>{row.label}</span>
          <span>{row.value}</span>
        </div>
      ))}
      <p className="replay__visual-note mono">{ledger.note}</p>
    </div>
  );
}

function JoinVisual({ join }) {
  return (
    <div className="replay__join">
      <div className="joinviz__scroll" tabIndex={0} role="region" aria-label="Settlement join diagram">
        <svg
          viewBox="0 0 580 250"
          className="joinviz__svg"
          role="img"
          aria-label={join.svgAlt}
        >
          <g className="joinviz__wires">
            <path d="M184 56 H232 Q248 56 248 72 V100 Q248 116 264 116 H284" pathLength="100" />
            <path d="M184 176 H232 Q248 176 248 160 V132 Q248 116 264 116 H284" pathLength="100" />
            <path className="joinviz__broken" d="M384 116 H452" pathLength="100" />
          </g>
          <g className="joinviz__flows">
            <path d="M184 56 H232 Q248 56 248 72 V100 Q248 116 264 116 H284" pathLength="100" />
            <path
              d="M184 176 H232 Q248 176 248 160 V132 Q248 116 264 116 H284"
              pathLength="100"
              style={{ animationDelay: "0.6s" }}
            />
          </g>
          <g className="joinviz__nodes">
            <g>
              <rect x="20" y="28" width="164" height="58" rx="6" />
              <text x="102" y="50" textAnchor="middle">{join.tour}</text>
              <text x="102" y="70" textAnchor="middle" className="joinviz__sub">{join.tourSub}</text>
            </g>
            <g>
              <rect x="20" y="148" width="164" height="58" rx="6" />
              <text x="102" y="170" textAnchor="middle">{join.load}</text>
              <text x="102" y="190" textAnchor="middle" className="joinviz__sub">{join.loadSub}</text>
            </g>
            <g className="joinviz__join">
              <rect x="284" y="88" width="100" height="56" rx="6" />
              <text x="334" y="110" textAnchor="middle">{join.join}</text>
              <text x="334" y="129" textAnchor="middle" className="joinviz__sub">{join.joinSub}</text>
            </g>
            <g className="joinviz__out">
              <rect x="452" y="88" width="108" height="56" rx="6" />
              <text x="506" y="120" textAnchor="middle">{join.payout}</text>
            </g>
          </g>
          <g className="joinviz__notes">
            <text x="418" y="104" textAnchor="middle" className="joinviz__loss">−47%</text>
            <path className="joinviz__leader" d="M334 144 V196" />
            <text x="334" y="216" textAnchor="middle" className="joinviz__fault">
              {join.fault}
            </text>
          </g>
        </svg>
      </div>
      <table className="jointable__table">
        <caption className="jointable__caption mono">{join.tableCaption}</caption>
        <thead>
          <tr>
            <th>{join.tableHead.rowType}</th>
            <th>{join.tableHead.loadId}</th>
            <th>{join.tableHead.amount}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{join.tour}</td>
            <td className="jointable__blank">—</td>
            <td>$1,240.00</td>
          </tr>
          <tr>
            <td>{join.load}</td>
            <td>LD-4471</td>
            <td>$380.00</td>
          </tr>
          <tr>
            <td>{join.load}</td>
            <td>LD-4472</td>
            <td>$295.00</td>
          </tr>
        </tbody>
      </table>
      <span className="joinviz__hint mono">{join.hint}</span>
    </div>
  );
}

function DateVisual({ dates }) {
  return (
    <div className="replay__dates">
      <div className="replay__daterow">
        <span className="replay__datelabel mono">{dates.settlement}</span>
        <div className="replay__bar">
          <span className="replay__bar-fill" style={{ left: "4%", width: "46%" }} />
        </div>
        <span className="replay__daterange mono">{dates.settlementRange}</span>
      </div>
      <div className="replay__daterow">
        <span className="replay__datelabel mono">{dates.tripLog}</span>
        <div className="replay__bar">
          <span className="replay__bar-fill replay__bar-fill--b" style={{ left: "30%", width: "55%" }} />
        </div>
        <span className="replay__daterange mono">{dates.tripRange}</span>
      </div>
      <p className="replay__visual-note mono">{dates.note}</p>
    </div>
  );
}

export default function InvestigationReplay() {
  const { t } = useLanguage();
  const replay = t("dataStory.replay");
  const STEPS = replay.steps;
  const [active, setActive] = useState(0);
  const [runId, setRunId] = useState(0);
  const [running, setRunning] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motion.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    motion.addEventListener("change", onChange);
    return () => motion.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running || reducedMotion) return undefined;
    const timer = setTimeout(() => {
      setActive((s) => (s + 1) % STEPS.length);
    }, STEP_MS);
    return () => clearTimeout(timer);
  }, [active, runId, running, reducedMotion, STEPS.length]);

  const goTo = (i) => {
    setActive(i);
    setRunId((r) => r + 1);
  };

  const step = STEPS[active];

  return (
    <div className="replay" ref={rootRef}>
      <div className="replay__stage">
        <div className="replay__visual" key={active}>
          {active === 0 && <LedgerVisual ledger={replay.ledger} />}
          {active === 1 && <JoinVisual join={replay.join} />}
          {active === 2 && <DateVisual dates={replay.dates} />}
        </div>
        <div className="replay__readout" aria-live="polite">
          <span className="replay__n">{step.value}</span>
          <span className="replay__k mono">{step.label}</span>
        </div>
      </div>

      <div className="replay__controls">
        <div className="replay__dots">
          {STEPS.map((s, i) => (
            <button
              key={s.n}
              type="button"
              aria-pressed={active === i}
              aria-label={`Show step ${s.n}: ${s.title}`}
              className={`replay__dot ${active === i ? "is-active" : ""}`}
              onClick={() => goTo(i)}
            >
              {s.n}
            </button>
          ))}
        </div>
        <button type="button" className="replay__restart mono" onClick={() => goTo(0)}>
          ↺ {replay.restart}
        </button>
      </div>

      <div className="faults">
        {STEPS.map((s, i) => (
          <div className={`fault ${active === i ? "is-active" : ""}`} key={s.n}>
            <span className="fault__n mono">{s.n}</span>
            <h3 className="fault__title">{s.title}</h3>
            <p className="fault__body">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
