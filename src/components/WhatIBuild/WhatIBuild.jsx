import { ArrowUpRight, Code2, Database, ShieldCheck } from "lucide-react";
import { PROOF } from "@/lib/projects";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./what-i-build.css";

const ICONS = [Code2, Database, ShieldCheck];
const GROUPS = [
  {
    title: "Full-stack engineering",
    items: [
      [
        "React · Next.js · TypeScript",
        "Role-specific web interfaces and application routing.",
        PROOF.frontend,
      ],
      [
        "Node.js · Fastify · REST",
        "Core application routes, validation and access control.",
        PROOF.api,
      ],
      [
        "FastAPI · Python",
        "A separate analytics service reached through internal HTTP.",
        PROOF.analytics,
      ],
      [
        "Prisma · PostgreSQL",
        "Relational schema and application queries.",
        PROOF.schema,
      ],
    ],
  },
  {
    title: "Data & ML",
    items: [
      [
        "Python · SQL · ETL",
        "Extracting and transforming application data for analytics.",
        PROOF.etl,
      ],
      [
        "Scikit-learn",
        "Random Forest training, balanced class weights and evaluation output.",
        PROOF.model,
      ],
      [
        "Celery · Redis",
        "Scheduled rescoring/retraining and short-lived application state.",
        PROOF.schedule,
      ],
    ],
  },
  {
    title: "Security & reliability",
    items: [
      [
        "JWT · Refresh tokens · TOTP",
        "JWT access, opaque refresh rotation and two-factor authentication.",
        PROOF.auth,
      ],
      [
        "RBAC · Ownership checks",
        "Route roles plus course and enrollment checks in attendance services.",
        PROOF.attendance,
      ],
      [
        "Rate limiting · Audit logging",
        "IP-keyed request limits and logging hooks in the core API.",
        PROOF.api,
      ],
      [
        "Testing · Docker · GitHub Actions",
        "Layer-specific checks and image publishing configured in CI.",
        PROOF.ci,
      ],
    ],
  },
];

export default function WhatIBuild() {
  return (
    <section className="section build" id="build" aria-labelledby="build-title">
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">04</span>
          <span>Capabilities</span>
          <span className="sec-label__bar" />
        </div>
        <div className="build__top">
          <h2 className="build__head" id="build-title">
            <SplitText text="Capabilities," as="span" />
            <br />
            <SplitText
              text="grounded in work."
              as="span"
              delay={110}
              className="build__head-dim"
            />
          </h2>
          <Reveal as="p" className="build__intro" delay={200}>
            Each area links to the implementation in SEASMP. The logistics
            investigation above shows how I approach record semantics and
            reconciliation.
          </Reveal>
        </div>
        <div className="capabilities">
          {GROUPS.map((g, gi) => {
            const Icon = ICONS[gi];
            return (
            <Reveal as="article" className="capability" key={g.title} delay={gi * 90}>
              <div className="capability__heading"><span className="capability__icon"><Icon size={22} /></span><span className="mono">0{gi + 1}</span></div>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map(([name, role, href]) => (
                  <li key={name}>
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <strong>{name}</strong>
                      <ArrowUpRight size={14} />
                    </a>
                    <p>{role}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
