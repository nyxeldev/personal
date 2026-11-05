import { ArrowRight, ArrowUpRight } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import SystemDiagram from "@/components/SystemDiagram/SystemDiagram";
import { SITE } from "@/lib/site";
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

          <h1 className="hero__name" aria-label={SITE.name}>
            <SplitText text="Jahongir" as="span" delay={60} />
            <SplitText
              text="Hamidov"
              as="span"
              delay={160}
              className="hero__name-last"
            />
          </h1>

          <Reveal className="hero__role" delay={380}>
            <span className="hero__role-main">Full-Stack Developer</span>
            <span className="hero__role-tags mono">Data · AI · Security</span>
          </Reveal>

          <Reveal as="p" className="hero__lead lead" delay={460}>
            From the interface to the data behind it.
            I build full-stack systems with analytics and security in mind.
          </Reveal>

          <Reveal className="hero__cta" delay={560}>
            <Magnetic strength={0.25} className="action-wrap">
              <a href="#work" className="btn btn--primary">
                View selected work
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
                View résumé
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="btn__arrow"
                />
              </a>
            </Magnetic>
          </Reveal>
          <div className="hero__direct">
            <a href={`mailto:${SITE.email}`}>Email me</a>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <span>Tashkent · Open to remote work</span>
          </div>
        </div>

        <Reveal className="hero__viz" delay={300}>
          <div className="hero__viz-top mono"><span>Inside the system</span><span>SEASMP / 01</span></div>
          <SystemDiagram />
          <span className="hero__viz-cap mono">
            SEASMP · service schematic
            <span className="hero__viz-hint"> — hover to trace</span>
          </span>
        </Reveal>
      </div>

      <Reveal className="hero__proof shell" delay={680}>
        <span className="mono">A closer look</span>
        <a href="#seasmp"><span>01</span><strong>Full-stack architecture</strong><ArrowUpRight size={16} /></a>
        <a href="#data"><span>02</span><strong>Real-world data investigation</strong><ArrowUpRight size={16} /></a>
        <a href="#decisions"><span>03</span><strong>The reasoning behind the code</strong><ArrowUpRight size={16} /></a>
      </Reveal>

      <div className="hero__floor shell" aria-hidden="true">
        <span className="mono">Scroll</span>
        <span className="hero__floor-line" />
        <span className="mono">01 / Selected work</span>
      </div>
    </section>
  );
}
