"use client";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import useLanguage from "@/hooks/useLanguage";
import "./experience.css";

export default function Experience() {
  const { t } = useLanguage();
  const entry = t("experience.entry");

  return (
    <section
      className="section experience"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">05</span>
          <span>{t("experience.sectionLabel")}</span>
          <span className="sec-label__bar" />
        </div>
        <div className="experience__head">
          <h2 id="experience-title">
            <SplitText text={t("experience.headingLine1")} as="span" />{" "}
            <SplitText text={t("experience.headingLine2")} as="span" delay={110} />
          </h2>
          <Reveal as="p" className="lead" delay={200}>
            {t("experience.lead")}
          </Reveal>
        </div>
        <div className="experience__timeline">
          <Reveal as="article" className="experience__entry" delay={160}>
            <span className="mono">{entry.period}</span>
            <h3>{entry.company}</h3>
            <p className="experience__role">{entry.role}</p>
            <p>{entry.body}</p>
            <a className="worklink" href="#data">
              {entry.link}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
