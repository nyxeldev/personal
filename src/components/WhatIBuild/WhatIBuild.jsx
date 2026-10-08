"use client";

import { useState } from "react";
import { Layers, Database, ShieldCheck } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./what-i-build.css";

const AREAS = [
  {
    id: "fullstack",
    icon: Layers,
    title: "Full-stack",
    blurb:
      "Product surfaces that stay fast under real data, backed by APIs designed for the query they actually serve.",
    stack: ["React", "Next.js", "Node.js", "FastAPI"],
  },
  {
    id: "data",
    icon: Database,
    title: "Data & ML",
    blurb:
      "Pipelines that reconcile messy source systems, and models that answer a question someone is waiting on.",
    stack: ["Python", "SQL", "PostgreSQL", "ETL", "ML"],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Security",
    blurb:
      "Access designed at the schema level, not bolted on — every privileged action traceable after the fact.",
    stack: ["RBAC", "JWT", "2FA", "Audit", "Rate limiting"],
  },
];

export default function WhatIBuild() {
  const [open, setOpen] = useState("fullstack");

  return (
    <section className="section build" id="build">
      <div className="shell">
        <Reveal className="sec-label">
          <span className="sec-label__num">02</span>
          <span>What I build</span>
          <span className="sec-label__bar" />
        </Reveal>

        <h2 className="build__head">
          <SplitText text="Three layers of the" as="span" />
          <SplitText text="same problem." as="span" delay={110} className="build__head-dim" />
        </h2>

        <div className="build__rows">
          {AREAS.map((a, i) => {
            const Icon = a.icon;
            const active = open === a.id;

            return (
              <Reveal key={a.id} delay={i * 90}>
                <button
                  type="button"
                  className={`area ${active ? "is-open" : ""}`}
                  onMouseEnter={() => setOpen(a.id)}
                  onFocus={() => setOpen(a.id)}
                  onClick={() => setOpen(a.id)}
                  aria-expanded={active}
                >
                  <span className="area__bar" aria-hidden="true" />

                  <span className="area__top">
                    <span className="area__icon">
                      <Icon size={18} strokeWidth={1.6} />
                    </span>
                    <span className="area__title">{a.title}</span>
                    <span className="area__idx mono">{String(i + 1).padStart(2, "0")}</span>
                  </span>

                  <span className="area__drawer">
                    <span className="area__drawer-in">
                      <span className="area__blurb">{a.blurb}</span>
                      <span className="area__stack">
                        {a.stack.map((s) => (
                          <span className="chip" key={s}>
                            {s}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
