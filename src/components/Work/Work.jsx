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
  { tier: "Client", items: ["Next.js App Router", "4 role-specific dashboards"] },
  {
    tier: "Gateway",
    items: ["Fastify core API", "4-role RBAC", "JWT refresh rotation", "Rate limiting"],
  },
  {
    tier: "Services",
    items: ["FastAPI — analytics & ML", "Celery — nightly rescoring"],
  },
  { tier: "Data", items: ["PostgreSQL", "Redis"] },
  { tier: "Ship", items: ["Docker", "GitHub Actions", "GHCR"] },
];

const PHASES = [
  {
    id: "problem",
    label: "Problem",
    body: "Four roles need one platform and almost none of the same data. And the question actually worth answering — which student is drifting — only has value while the term is still running, not in a report written after it ends. Attendance on top of that has to be taken in seconds, from a phone, with a code nobody can forward to a friend.",
  },
  {
    id: "architecture",
    label: "Architecture",
    body: "A Fastify core API alongside a FastAPI analytics service, talking over an internal HTTP contract. I chose synchronous calls over a message broker because inter-service volume is low and I wanted the failure mode to stay legible: an analytics outage degrades the /analytics routes and nothing else, instead of quietly queueing work nobody is watching. PostgreSQL is the system of record, Redis holds short-lived state, Celery runs everything scheduled.",
  },
  {
    id: "engineering",
    label: "Engineering",
    body: "Four role-specific dashboards on a single Next.js App Router codebase — route guards, role-conditional rendering and per-role fetching, so a student session never issues an admin query in the first place. QR attendance runs end to end in the browser: camera capture, a one-time Redis token on a 5-minute TTL verified against the JWT actor, and an optimistic UI that rolls back the moment the server rejects.",
  },
  {
    id: "model",
    label: "Model",
    body: "An ETL pipeline over production tables feeds eight behavioural features into a Random Forest with balanced class weights. Celery rescores nightly; the monthly retrain is promoted only when its AUC beats the model already deployed. The honest caveat: at 191 enrollments and 6 dropout events the dataset is still small, so what is proven today is the pipeline end to end — it re-validates itself as the data grows.",
  },
  {
    id: "security",
    label: "Security",
    body: "Four-role RBAC with ownership checks at the service layer rather than only on the route, so authorisation does not depend on which entry point was used. JWT refresh rotation, TOTP two-factor, rate limiting, and a before/after audit log — every privileged change traces back to a person, a time and the value it replaced.",
  },
  {
    id: "shipping",
    label: "Shipping",
    body: "Five CI jobs running in parallel — Jest, Vitest, a Postgres and Redis integration suite, pytest and Playwright — then a Docker build, then GHCR. The spread is the point: each layer gets checked by something that can actually see it.",
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
              <p className="cs__meta mono">Solo developer · May 2026 — present</p>
            </div>

            <div className="cs__aside">
              <span className="cs__badge mono">Fastify · FastAPI · PostgreSQL</span>
              <a
                className="worklink"
                href="https://github.com/nyxeldev/seasmp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} strokeWidth={1.8} />
                nyxeldev/seasmp
              </a>
            </div>
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

          {/* eng qiziq topilma — alohida ajratilgan */}
          <div className="find">
            <span className="find__label mono">The bug worth keeping</span>
            <p className="find__body">
              Behind Nginx, <code>request.ip</code> resolved to the container address.
              One line, three silent failures at once: rate limiting bucketed every
              visitor into the same counter, audit attribution recorded the proxy
              instead of the actor, and the unknown-IP anomaly signal could never fire.
              Every test stayed green throughout — they were asserting the behaviour of
              the code, not of the deployment it runs in.
            </p>
          </div>

          {/*
            Keyingi qadamlar rezyumedagi faktlardan kelib chiqadi
            (kichik dataset, sinxron chaqiruvlar) — Jahongir o'z fikriga
            ko'ra to'g'rilashi mumkin.
          */}
          <div className="next">
            <span className="next__label mono">What I would improve next</span>
            <ul className="next__list">
              <li>
                The model is the honest weak point. Six dropout events is not enough
                to trust a score, so the next move is more signal rather than a
                better algorithm — attendance streaks and assignment latency before
                anything fancier.
              </li>
              <li>
                Synchronous service calls were the right trade at this volume, but
                there is no backpressure if analytics slows down. A timeout budget
                and a circuit breaker come before a broker does.
              </li>
              <li>
                The request.ip bug got through because nothing tested the app behind
                its own proxy. A single integration test that runs through Nginx
                would have caught it, and would catch the next one like it.
              </li>
            </ul>
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
