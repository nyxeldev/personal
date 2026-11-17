"use client";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import useLanguage from "@/hooks/useLanguage";
import "./who-i-am.css";

export default function WhoIAm() {
  const { t } = useLanguage();
  const facts = t("about.facts");

  return (
    <section className="section who" id="about" aria-labelledby="about-title">
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">06</span>
          <span>{t("about.sectionLabel")}</span>
          <span className="sec-label__bar" />
        </div>
        <div className="who__grid">
          <div className="who__main">
            <h2 className="who__head" id="about-title">
              <SplitText text={t("about.headingLine1")} as="span" />
              <SplitText
                text={t("about.headingLine2")}
                as="span"
                delay={110}
                className="who__head-dim"
              />
            </h2>
            <Reveal as="p" className="who__body" delay={180}>
              {t("about.body1")}
            </Reveal>
            <Reveal as="p" className="who__body" delay={240}>
              {t("about.body2")}
            </Reveal>
          </div>
          <div className="who__facts">
            {facts.map((f, i) => (
              <Reveal className="fact" key={f.k} delay={120 + i * 70}>
                <span className="fact__k mono">{f.k}</span>
                <span className="fact__v">{f.v}</span>
                <span className="fact__sub">{f.sub}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
