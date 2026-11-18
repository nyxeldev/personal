"use client";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import SystemDiagram from "@/components/SystemDiagram/SystemDiagram";
import { SITE } from "@/lib/site";
import useLanguage from "@/hooks/useLanguage";
import "./hero.css";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="hero" id="top">
      <div className="grid-bg" aria-hidden="true" />

      <div className="hero__inner shell">
        <div className="hero__copy">
          <Reveal className="hero__eyebrow">
            <span className="hero__dot" aria-hidden="true" />
            <span className="mono">{t("hero.available")}</span>
            <span className="hero__sep" aria-hidden="true" />
            <span className="mono">{t("hero.location")}</span>
          </Reveal>

          <h1 className="hero__name" aria-label="Jahongir Hamidov">
            <SplitText text="Jahongir" as="span" delay={60} />
            <SplitText
              text="Hamidov"
              as="span"
              delay={160}
              className="hero__name-last"
            />
          </h1>

          <Reveal className="hero__role" delay={380}>
            <span className="hero__role-main">{t("hero.role")}</span>
          </Reveal>

          <Reveal as="p" className="hero__lead lead" delay={460}>
            {t("hero.lead")}
          </Reveal>

          <Reveal className="hero__cta" delay={560}>
            <Magnetic strength={0.25} className="action-wrap">
              <a href="#work" className="btn btn--primary">
                {t("hero.ctaPrimary")}
                <ArrowRight size={16} strokeWidth={2} className="btn__arrow" />
              </a>
            </Magnetic>

            <Magnetic strength={0.25} className="action-wrap">
              <a
                href="/files/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost"
              >
                {t("hero.ctaResume")}
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="btn__arrow"
                />
              </a>
            </Magnetic>
          </Reveal>
          <div className="hero__direct">
            <a href={`mailto:${SITE.email}`}>{t("hero.emailMe")}</a>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer">
              {t("hero.github")} ↗
            </a>
            <span>{t("hero.directNote")}</span>
          </div>
        </div>

        <Reveal className="hero__viz" delay={300}>
          <div className="hero__viz-top mono"><span>{t("hero.insideSystem")}</span><span>{t("hero.seasmpTag")}</span></div>
          <SystemDiagram />
          <span className="hero__viz-cap mono">
            {t("hero.vizCaption")}
            <span className="hero__viz-hint">{t("hero.vizHint")}</span>
          </span>
        </Reveal>
      </div>

      <Reveal className="hero__proof shell" delay={680}>
        <span className="mono">{t("hero.closerLook")}</span>
        <a href="#seasmp"><span>01</span><strong>{t("hero.proof1")}</strong><ArrowUpRight size={16} /></a>
        <a href="#data"><span>02</span><strong>{t("hero.proof2")}</strong><ArrowUpRight size={16} /></a>
        <a href="#decisions"><span>03</span><strong>{t("hero.proof3")}</strong><ArrowUpRight size={16} /></a>
      </Reveal>

    </section>
  );
}
