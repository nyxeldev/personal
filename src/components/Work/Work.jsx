"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import ielts from "../../../public/images/project3.png";
import "./work.css";

// IELTS kartasi uchun oldindan tayyorlangan blur (output: "export" da optimizator ishlamaydi)
const ieltsBlur =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAHAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIhAAAgEEAQQDAAAAAAAAAAAAAQIDAAQFESESEzFBByNR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAZEQEAAwEBAAAAAAAAAAAAAAABAAIRISL/2gAMAwEAAhEDEQA/AMzkMrNc3bySSEknQG+APVQoWJmUE8E6NFFb1UCpyIsm91//2Q==";

// SEASMP arxitekturasi — qatlamlar bo'yicha
const STACK = [
  { tier: "Client", items: ["4 role-specific dashboards"] },
  { tier: "Gateway", items: ["Fastify", "JWT refresh rotation", "RBAC", "Rate limiting"] },
  { tier: "Services", items: ["FastAPI — analytics & ML", "Celery — scheduled ETL"] },
  { tier: "Data", items: ["PostgreSQL", "Redis"] },
];

/**
 * Faza matnlari brief'dagi faktlarga tayanadi.
 * Problem va Result bandlari umumiy ta'rif — real raqamlar bilan almashtirilishi kerak.
 */
const PHASES = [
  {
    id: "problem",
    label: "Problem",
    body: "Attendance, grades and engagement lived in disconnected spreadsheets. Nobody held a single view of a cohort, and a student drifting off track surfaced at the end of term — far too late to act on.",
  },
  {
    id: "architecture",
    label: "Architecture",
    body: "Two services behind one gateway. Fastify fronts the product API and owns auth and access control; FastAPI runs analytics and the model, so a heavy query never blocks a page load. PostgreSQL is the system of record, Redis holds short-lived state, and Celery runs the scheduled work.",
  },
  {
    id: "engineering",
    label: "Engineering",
    body: "Four role-specific dashboards, each scoped to what that role may actually see. Attendance is taken by QR code backed by a Redis one-time token, so a screenshotted code is already spent. An ETL pipeline feeds a Random Forest model that flags at-risk students while the term is still running.",
  },
  {
    id: "security",
    label: "Security",
    body: "RBAC enforced at the data layer rather than in the UI. JWT refresh rotation, TOTP two-factor authentication, rate limiting on public routes, and audit logging on privileged actions so any change traces back to a person and a time.",
  },
  {
    id: "result",
    label: "Result",
    body: "One platform in place of the spreadsheet workflow: live attendance, role-correct dashboards, and early warning on students at risk — with a CI pipeline keeping each change verified before it ships.",
  },
];

export default function Work() {
  const [phase, setPhase] = useState("problem");
  const current = PHASES.find((p) => p.id === phase);

  return (
    <section className="section work" id="work">
      <div className="shell">
        <Reveal className="sec-label">
          <span className="sec-label__num">03</span>
          <span>Selected work</span>
          <span className="sec-label__bar" />
        </Reveal>

        <h2 className="work__head">
          <SplitText text="Fewer projects." as="span" />
          <SplitText text="More depth." as="span" delay={110} className="work__head-dim" />
        </h2>

        {/* ---------- asosiy case study ---------- */}
        <Reveal className="cs" delay={120}>
          <div className="cs__head">
            <div>
              <span className="cs__kicker mono">Case study — 01</span>
              <h3 className="cs__title">SEASMP</h3>
              <p className="cs__sub">Education Analytics &amp; Monitoring Platform</p>
            </div>
            <span className="cs__badge mono">Fastify · FastAPI · PostgreSQL</span>
          </div>

          {/* arxitektura qatlamlari */}
          <div className="stackmap">
            {STACK.map((layer, i) => (
              <div className="stackmap__row" key={layer.tier} style={{ "--i": i }}>
                <span className="stackmap__tier mono">{layer.tier}</span>
                <div className="stackmap__items">
                  {layer.items.map((it) => (
                    <span className="stackmap__cell" key={it}>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* fazalar */}
          <div className="phases">
            <div className="phases__tabs" role="tablist" aria-label="Case study phases">
              {PHASES.map((p) => (
                <button
                  key={p.id}
                  role="tab"
                  type="button"
                  id={`tab-${p.id}`}
                  aria-selected={phase === p.id}
                  aria-controls={`panel-${p.id}`}
                  className={`phases__tab ${phase === p.id ? "is-active" : ""}`}
                  onClick={() => setPhase(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div
              className="phases__panel"
              role="tabpanel"
              id={`panel-${current.id}`}
              aria-labelledby={`tab-${current.id}`}
              key={current.id}
            >
              <p>{current.body}</p>
            </div>
          </div>
        </Reveal>

        {/* ---------- ikkinchi ish ---------- */}
        <Reveal className="mini" delay={160}>
          <a
            className="mini__media"
            href="https://speakready.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="IELTS Speaking Practice — open live demo"
          >
            <Parallax amount={26}>
              <Image
                src={ielts}
                alt="IELTS Speaking Practice interface"
                width={760}
                height={420}
                placeholder="blur"
                blurDataURL={ieltsBlur}
                sizes="(max-width: 920px) 100vw, 50vw"
              />
            </Parallax>
          </a>

          <div className="mini__body">
            <span className="cs__kicker mono">Case study — 02</span>
            <h3 className="mini__title">IELTS Speaking Practice</h3>
            <p className="mini__text">
              A focused tool that generates randomised questions for each IELTS Speaking
              part. Minimal by design — the point is to start talking, not to read an
              interface.
            </p>

            <div className="mini__chips">
              {["Next.js", "CSS", "Ant Design", "REST API"].map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>

            <div className="mini__links">
              <a
                href="https://speakready.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="worklink"
              >
                Live demo
                <ArrowUpRight size={15} strokeWidth={2} className="btn__arrow" />
              </a>
              <a
                href="https://github.com/nyxeldev/speaking-new"
                target="_blank"
                rel="noopener noreferrer"
                className="worklink"
              >
                <Github size={15} strokeWidth={1.8} />
                Source
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
