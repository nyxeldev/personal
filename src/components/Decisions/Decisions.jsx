import { ArrowUpRight } from "lucide-react";
import { PROOF } from "@/lib/projects";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./decisions.css";

const DECISIONS = [
  {
    title: "Separate request handling from analytics",
    reason:
      "Fastify handles the core application; FastAPI keeps Python analytics in its own service. Different runtimes and workloads can evolve independently.",
    cost: "An HTTP hop and a contract to maintain. Explicit timeout and failure handling still need work.",
    proof: PROOF.analytics,
    label: "Analytics routes",
  },
  {
    title: "Check ownership inside the service",
    reason:
      "Role checks protect routes; attendance service checks also verify course ownership or student enrollment before working with records.",
    cost: "Authorization logic needs consistent coverage across services and new entry points.",
    proof: PROOF.attendance,
    label: "Ownership checks",
  },
  {
    title: "Weight an imbalanced classification problem",
    reason:
      "The Random Forest uses balanced class weights so the rare dropout class contributes more to training than its raw frequency would.",
    cost: "Class weighting does not solve a small dataset or establish useful predictions. Precision, recall and validation stability still matter.",
    proof: PROOF.model,
    label: "Model training",
  },
  {
    title: "Test each layer with a suitable tool",
    reason:
      "The CI configuration separates API units, web units, database integration, Python tests and browser flows before building images.",
    cost: "More test environments to maintain. Proxy behavior and inter-service failures still need their own checks.",
    proof: PROOF.ci,
    label: "CI configuration",
  },
];

export default function Decisions() {
  return (
    <section
      className="section decisions"
      id="decisions"
      aria-labelledby="decisions-title"
    >
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">03</span>
          <span>Engineering decisions</span>
          <span className="sec-label__bar" />
        </div>
        <div className="decisions__top">
          <h2 className="decisions__head" id="decisions-title">
            <SplitText text="Every choice" as="span" />
            <br />
            <SplitText
              text="costs something."
              as="span"
              delay={110}
              className="decisions__head-dim"
            />
          </h2>
          <Reveal as="p" className="decisions__intro" delay={200}>
            Four implementation choices from SEASMP, with their reasons, costs
            and source evidence.
          </Reveal>
        </div>
        <div className="decision-grid">
          {DECISIONS.map((d, i) => (
            <Reveal as="article" className="decision-card" key={d.title} delay={i * 90}>
              <span className="mono">0{i + 1} / SEASMP</span>
              <h3>{d.title}</h3>
              <p>{d.reason}</p>
              <p className="decision-card__cost">
                <strong>Trade-off</strong> {d.cost}
              </p>
              <a
                className="worklink"
                href={d.proof}
                target="_blank"
                rel="noopener noreferrer"
              >
                {d.label}
                <ArrowUpRight size={14} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
