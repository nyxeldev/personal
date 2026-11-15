"use client";
import { ArrowUpRight } from "lucide-react";
import { PROOF } from "@/lib/projects";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import useLanguage from "@/hooks/useLanguage";
import "./decisions.css";

const PROOFS = [PROOF.analytics, PROOF.attendance, PROOF.model, PROOF.retraining];

export default function Decisions() {
  const { t } = useLanguage();
  const items = t("decisions.items");

  return (
    <section
      className="section decisions"
      id="decisions"
      aria-labelledby="decisions-title"
    >
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">03</span>
          <span>{t("decisions.sectionLabel")}</span>
          <span className="sec-label__bar" />
        </div>
        <div className="decisions__top">
          <h2 className="decisions__head" id="decisions-title">
            <SplitText text={t("decisions.headingLine1")} as="span" />
            <br />
            <SplitText
              text={t("decisions.headingLine2")}
              as="span"
              delay={110}
              className="decisions__head-dim"
            />
          </h2>
          <Reveal as="p" className="decisions__intro" delay={200}>
            {t("decisions.intro")}
          </Reveal>
        </div>
        <div className="decision-grid">
          {items.map((d, i) => (
            <Reveal as="article" className="decision-card" key={d.title} delay={i * 90}>
              <span className="mono">0{i + 1} / SEASMP</span>
              <h3>{d.title}</h3>
              <p>{d.reason}</p>
              <p className="decision-card__cost">
                <strong>{t("decisions.tradeOff")}</strong> {d.cost}
              </p>
              <a
                className="worklink"
                href={PROOFS[i]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {d.label}
                <ArrowUpRight size={14} />
              </a>
            </Reveal>
          ))}
        </div>
        <p className="decisions__footnote">
          {t("decisions.footnotePrefix")}{" "}
          <a
            className="worklink"
            href={PROOF.ci}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("decisions.footnoteLink")}
            <ArrowUpRight size={13} />
          </a>
        </p>
      </div>
    </section>
  );
}
