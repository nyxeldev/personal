"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./decisions.css";

/**
 * Har bir qaror rezyumedagi real tanlovga tayanadi.
 * "cost" — ataylab: har bir qarorning narxi bor, buni aytmaslik soxta ko'rinadi.
 */
const DECISIONS = [
  {
    q: "Why two services instead of one?",
    tag: "SEASMP",
    a: "Analytics work and request handling have different shapes: one is bursty and CPU-heavy, the other has to answer in milliseconds. Keeping the FastAPI analytics service separate from the Fastify core API means a slow model run cannot occupy a worker that a login needs.",
    cost: "Two deployables, one more network hop, and a contract to keep in sync.",
  },
  {
    q: "Why synchronous calls rather than a message broker?",
    tag: "SEASMP",
    a: "Inter-service volume is low, and a broker buys throughput I do not need while costing a failure mode I would rather not have: work silently queueing while nobody looks. Synchronous calls make the outage legible — if analytics is down, /analytics returns an error and the rest of the product keeps working.",
    cost: "If volume grows, this is the first thing that has to change.",
  },
  {
    q: "Why a one-time Redis token behind the QR code?",
    tag: "SEASMP",
    a: "A plain QR code is a screenshot away from being forwarded to a friend sitting at home. The code carries a token that lives five minutes in Redis and is verified against the JWT actor presenting it, so it is bound to one person and spent on first use.",
    cost: "Attendance now depends on Redis being up; that is a trade I will take over attendance being fiction.",
  },
  {
    q: "Why enforce RBAC at the service layer, not the route?",
    tag: "SEASMP",
    a: "Route guards only protect the doors you remember to guard. Putting ownership checks in the service means authorisation does not depend on which entry point was used — a new route, a background job and a test all go through the same check.",
    cost: "Slightly more code per call site, and the checks have to be cheap enough to run every time.",
  },
  {
    q: "Why gate the monthly retrain on AUC?",
    tag: "SEASMP",
    a: "An automatic retrain that always ships is a pipeline that can quietly make the model worse. The new model is promoted only when it beats the deployed one on AUC, so a bad month of data degrades nothing.",
    cost: "The model can go stale if it keeps losing to an older one — which is the signal to look at the features, not to lower the bar.",
  },
  {
    q: "Why balanced class weights on the Random Forest?",
    tag: "SEASMP",
    a: "There are 6 dropout events across 191 enrollments. A model optimising raw accuracy on that split learns to predict “no dropout” every time and scores 97%. Balanced class weights make the rare class cost what it should.",
    cost: "More false positives. For early warning that is the right direction to be wrong in.",
  },
  {
    q: "Why fixed-point decimals for money?",
    tag: "Logistics",
    a: "Floats lose cents, and they lose them inconsistently — which is exactly the kind of error that survives review because every individual number looks plausible. Payroll has to reconcile to zero, not to nearly zero.",
    cost: "Every arithmetic path has to be deliberate about rounding instead of inheriting it.",
  },
  {
    q: "Why keep compensation rules in the database?",
    tag: "Logistics",
    a: "Pay rules change on business time, not release time. Holding them as data means a rate change is a row, not a deploy — and the four models I validated can be compared against real payroll without rebuilding anything.",
    cost: "Rules in data need their own validation; a bad row is now as dangerous as bad code.",
  },
  {
    q: "Why isolate tenants at both the ORM and the database?",
    tag: "Logistics",
    a: "ORM-level scoping is the layer that gets forgotten — one raw query, one new endpoint, and a tenant filter goes missing. PostgreSQL row-level security is the backstop that does not depend on anyone remembering.",
    cost: "Policies have to be maintained alongside the schema, and debugging a query you cannot see is harder.",
  },
  {
    q: "Why five separate CI jobs?",
    tag: "SEASMP",
    a: "Jest, Vitest, a Postgres and Redis integration suite, pytest and Playwright each see a different layer. The request.ip bug behind Nginx is the argument for the spread: unit tests stayed green because they were asserting the code, not the deployment.",
    cost: "A slower pipeline, and five places to keep healthy.",
  },
];

export default function Decisions() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section decisions engineer-only" id="decisions">
      <div className="shell">
        <Reveal className="sec-label">
          <span className="sec-label__num">05</span>
          <span>Engineering decisions</span>
          <span className="sec-label__bar" />
        </Reveal>

        <div className="decisions__top">
          <h2 className="decisions__head">
            <SplitText text="Every choice" as="span" />
            <SplitText text="costs something." as="span" delay={110} className="decisions__head-dim" />
          </h2>

          <Reveal as="p" className="decisions__intro" delay={200}>
            A stack list says what I used. These say why, and what I gave up to get
            it — which is the part that actually tells you how someone thinks.
          </Reveal>
        </div>

        <div className="decisions__list">
          {DECISIONS.map((d, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={d.q} delay={Math.min(i, 5) * 60}>
                <div className={`dec ${isOpen ? "is-open" : ""}`}>
                  <h3 className="dec__h">
                    <button
                      type="button"
                      className="dec__q"
                      aria-expanded={isOpen}
                      aria-controls={`dec-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <Plus size={16} strokeWidth={1.8} className="dec__sign" />
                      <span className="dec__text">{d.q}</span>
                      <span className="dec__tag mono">{d.tag}</span>
                    </button>
                  </h3>

                  <div className="dec__drawer" id={`dec-${i}`} role="region">
                    <div className="dec__inner">
                      <p className="dec__a">{d.a}</p>
                      <p className="dec__cost">
                        <span className="mono">Trade-off</span>
                        {d.cost}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
