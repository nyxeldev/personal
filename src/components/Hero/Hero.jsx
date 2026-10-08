"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import SystemDiagram from "@/components/SystemDiagram/SystemDiagram";
import "./hero.css";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="grid-bg" aria-hidden="true" />

      <div className="hero__inner shell">
        <div className="hero__copy">
          <Reveal className="hero__eyebrow">
            <span className="hero__dot" aria-hidden="true" />
            <span className="mono">Available for work</span>
            <span className="hero__sep" aria-hidden="true" />
            <span className="mono">Tashkent, UZ</span>
          </Reveal>

          <h1 className="hero__name">
            <SplitText text="Jahongir" as="span" delay={60} />
            <SplitText text="Hamidov" as="span" delay={160} className="hero__name-last" />
          </h1>

          <Reveal className="hero__role" delay={380}>
            <span className="hero__role-main">Full-Stack Developer</span>
            <span className="hero__role-tags mono">Data · AI · Security</span>
          </Reveal>

          <Reveal as="p" className="hero__lead lead" delay={460}>
            I build intelligent, data-driven systems with a focus on reliable backend
            architecture and security.
          </Reveal>

          <Reveal className="hero__cta" delay={560}>
            <Magnetic strength={0.25}>
              <a href="#work" className="btn btn--primary">
                View selected work
                <ArrowRight size={16} strokeWidth={2} className="btn__arrow" />
              </a>
            </Magnetic>

            <Magnetic strength={0.25}>
              <a
                href="/files/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost"
              >
                Download résumé
                <ArrowUpRight size={16} strokeWidth={2} className="btn__arrow" />
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal className="hero__viz" delay={300}>
          <SystemDiagram />
          <span className="hero__viz-cap mono">
            live architecture
            <span className="hero__viz-hint"> — hover to trace</span>
          </span>
        </Reveal>
      </div>

      <div className="hero__floor shell" aria-hidden="true">
        <span className="mono">Scroll</span>
        <span className="hero__floor-line" />
        <span className="mono">01 / Who I am</span>
      </div>
    </section>
  );
}
