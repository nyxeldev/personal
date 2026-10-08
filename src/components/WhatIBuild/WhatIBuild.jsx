"use client";

import { useState } from "react";
import { Layers, Server, Database, ShieldCheck, Container } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./what-i-build.css";

/**
 * Skill → Evidence → Project.
 * Har bir texnologiya qayerda, nima uchun ishlatilganini ko'rsatadi —
 * ro'yxat emas, isbot. Barcha bog'lanishlar rezyumedagi real ishlardan.
 */

const SEASMP = { label: "SEASMP", href: "#work" };
const LOGISTICS = { label: "Logistics analytics", href: "#data" };
const IELTS = { label: "IELTS Speaking", href: "#work" };

const GROUPS = [
  {
    id: "frontend",
    icon: Layers,
    title: "Frontend",
    items: [
      { name: "Next.js", role: "App Router, route guards, per-role fetching", used: [SEASMP, IELTS] },
      { name: "React", role: "Role-conditional dashboards, optimistic UI", used: [SEASMP, IELTS] },
      { name: "TypeScript", role: "Contracts between the UI and the API", used: [SEASMP] },
      { name: "Tailwind CSS", role: "Layout system across four dashboards", used: [SEASMP] },
      { name: "shadcn/ui", role: "Component base, kept accessible by default", used: [SEASMP] },
    ],
  },
  {
    id: "backend",
    icon: Server,
    title: "Backend",
    items: [
      { name: "Fastify", role: "Core API — auth, access control, rate limiting", used: [SEASMP] },
      { name: "FastAPI", role: "Analytics service, isolated from request handling", used: [SEASMP] },
      { name: "Node.js", role: "Runtime for the core API and its jobs", used: [SEASMP] },
      { name: "Prisma ORM", role: "Schema, migrations, tenant-scoped queries", used: [SEASMP, LOGISTICS] },
      { name: "WebSockets", role: "Live attendance state as it is taken", used: [SEASMP] },
    ],
  },
  {
    id: "data",
    icon: Database,
    title: "Data & ML",
    items: [
      { name: "PostgreSQL", role: "System of record; fixed-point money, RLS policies", used: [SEASMP, LOGISTICS] },
      { name: "Python", role: "ETL, settlement reconciliation, model training", used: [SEASMP, LOGISTICS] },
      { name: "SQL", role: "Reconciling TOUR and LOAD exports against payroll", used: [LOGISTICS] },
      { name: "Scikit-learn", role: "Random Forest, 8 features, balanced class weights", used: [SEASMP] },
      { name: "Celery", role: "Nightly rescoring and the monthly retrain gate", used: [SEASMP] },
      { name: "Redis", role: "One-time QR tokens on a 5-minute TTL", used: [SEASMP] },
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Security",
    items: [
      { name: "RBAC", role: "Four roles, ownership checked at the service layer", used: [SEASMP] },
      { name: "JWT rotation", role: "Refresh rotation so a stolen token has a short life", used: [SEASMP] },
      { name: "TOTP 2FA", role: "Second factor on privileged accounts", used: [SEASMP] },
      { name: "Audit logging", role: "Before/after values on every privileged change", used: [SEASMP] },
      { name: "Rate limiting", role: "Per-actor limits — the bug that hid behind Nginx", used: [SEASMP] },
      { name: "Postgres RLS", role: "Tenant isolation that survives a forgotten filter", used: [LOGISTICS] },
    ],
  },
  {
    id: "infra",
    icon: Container,
    title: "Infrastructure & testing",
    items: [
      { name: "Docker", role: "Reproducible builds, published to GHCR", used: [SEASMP] },
      { name: "GitHub Actions", role: "Five parallel jobs before anything ships", used: [SEASMP] },
      { name: "Playwright", role: "End-to-end flows per role", used: [SEASMP] },
      { name: "pytest", role: "Analytics service and pipeline coverage", used: [SEASMP] },
      { name: "Jest / Vitest", role: "Unit coverage on both JS runtimes", used: [SEASMP] },
      { name: "Nginx", role: "Reverse proxy — and the source of a real bug", used: [SEASMP] },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.id })));

export default function WhatIBuild() {
  const [active, setActive] = useState("PostgreSQL");
  const current = ALL.find((it) => it.name === active) ?? ALL[0];

  return (
    <section className="section build" id="build">
      <div className="shell">
        <Reveal className="sec-label">
          <span className="sec-label__num">02</span>
          <span>Expertise</span>
          <span className="sec-label__bar" />
        </Reveal>

        <div className="build__top">
          <h2 className="build__head">
            <SplitText text="Not a list." as="span" />
            <SplitText text="A map of evidence." as="span" delay={110} className="build__head-dim" />
          </h2>

          <Reveal as="p" className="build__intro" delay={200}>
            Pick anything below and it will tell you where I actually used it and what
            it was doing there. Nothing here is on the list because I read about it.
          </Reveal>
        </div>

        <div className="build__grid">
          <div className="build__groups">
            {GROUPS.map((g, gi) => {
              const Icon = g.icon;
              return (
                <Reveal className="grp" key={g.id} delay={gi * 70}>
                  <div className="grp__head">
                    <span className="grp__icon">
                      <Icon size={15} strokeWidth={1.7} />
                    </span>
                    <span className="grp__title mono">{g.title}</span>
                  </div>

                  <div className="grp__items">
                    {g.items.map((it) => (
                      <button
                        type="button"
                        key={it.name}
                        className={`tech ${active === it.name ? "is-on" : ""}`}
                        onMouseEnter={() => setActive(it.name)}
                        onFocus={() => setActive(it.name)}
                        onClick={() => setActive(it.name)}
                        aria-pressed={active === it.name}
                      >
                        {it.name}
                      </button>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* dalil paneli */}
          <Reveal className="ev" delay={160}>
            <div className="ev__card" aria-live="polite">
              <span className="ev__label mono">Evidence</span>
              <h3 className="ev__name">{current.name}</h3>

              <dl className="ev__rows">
                <div className="ev__row">
                  <dt className="mono">Role</dt>
                  <dd>{current.role}</dd>
                </div>
                <div className="ev__row">
                  <dt className="mono">Used in</dt>
                  <dd className="ev__links">
                    {current.used.map((p) => (
                      <a className="ev__link" href={p.href} key={p.label}>
                        {p.label}
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
