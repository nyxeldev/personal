"use client";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import InvestigationReplay from "./InvestigationReplay";
import useLanguage from "@/hooks/useLanguage";
import "./data-story.css";

const STAT_NUMBERS = [
  { to: 2, suffix: "×" },
  { to: 47, suffix: "%" },
  { to: 4, suffix: "" },
  { to: 0, suffix: "" },
];

export default function DataStory() {
  const { t } = useLanguage();
  const stats = t("dataStory.stats");

  return (
    <section className="section datastory" id="data">
      <div className="shell">
        <Reveal className="sec-label">
          <span className="sec-label__num">02</span>
          <span>{t("dataStory.sectionLabel")}</span>
          <span className="sec-label__bar" />
        </Reveal>

        <div className="datastory__top">
          <h2 className="datastory__head">
            <SplitText text={t("dataStory.headingLine1")} as="span" />
            <SplitText
              text={t("dataStory.headingLine2")}
              as="span"
              delay={140}
              className="datastory__head-accent"
            />
          </h2>

          <Reveal as="p" className="datastory__intro" delay={240}>
            {t("dataStory.intro")}
          </Reveal>
        </div>

        {/* ---------- tergov replayi ---------- */}
        <Reveal delay={180}>
          <InvestigationReplay />
        </Reveal>

        {/* ---------- natija ---------- */}
        <Reveal className="datastory__out" delay={120}>
          <span className="datastory__out-label mono">{t("dataStory.outLabel")}</span>
          <p className="datastory__body">{t("dataStory.out")}</p>
        </Reveal>

        <p className="datastory__note">{t("dataStory.note")}</p>
        <div className="statrow">
          {stats.map((s, i) => (
            <Reveal className="stat" key={s.k} delay={i * 90}>
              <span className="stat__n">
                <Counter to={STAT_NUMBERS[i].to} suffix={STAT_NUMBERS[i].suffix} />
              </span>
              <span className="stat__k">{s.k}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
