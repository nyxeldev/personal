"use client";
import { ArrowUpRight, Code2, Database, ShieldCheck } from "lucide-react";
import { PROOF } from "@/lib/projects";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import useLanguage from "@/hooks/useLanguage";
import "./what-i-build.css";

const ICONS = [Code2, Database, ShieldCheck];
const HREFS = [
  [PROOF.frontend, PROOF.api, PROOF.analytics, PROOF.schema],
  [PROOF.etl, PROOF.model, PROOF.schedule],
  [PROOF.auth, PROOF.attendance, PROOF.api, PROOF.ci],
];

export default function WhatIBuild() {
  const { t } = useLanguage();
  const groups = t("build.groups");

  return (
    <section className="section build" id="build" aria-labelledby="build-title">
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">04</span>
          <span>{t("build.sectionLabel")}</span>
          <span className="sec-label__bar" />
        </div>
        <div className="build__top">
          <h2 className="build__head" id="build-title">
            <SplitText text={t("build.headingLine1")} as="span" />{" "}
            <SplitText text={t("build.headingLine2")} as="span" delay={110} />
          </h2>
          <Reveal as="p" className="build__intro lead" delay={200}>
            {t("build.intro")}
          </Reveal>
        </div>
        <div className="capabilities">
          {groups.map((g, gi) => {
            const Icon = ICONS[gi];
            return (
              <Reveal as="article" className="capability" key={g.title} delay={gi * 90}>
                <div className="capability__heading">
                  <span className="capability__icon">
                    <Icon size={22} />
                  </span>
                  <span className="mono">0{gi + 1}</span>
                </div>
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((item, ii) => (
                    <li key={item.name}>
                      <a href={HREFS[gi][ii]} target="_blank" rel="noopener noreferrer">
                        <strong>{item.name}</strong>
                        <ArrowUpRight size={14} />
                      </a>
                      <p>{item.role}</p>
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
