import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./experience.css";

export default function Experience() {
  return (
    <section
      className="section experience"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">05</span>
          <span>Experience</span>
          <span className="sec-label__bar" />
        </div>
        <div className="experience__grid">
          <div>
            <h2 id="experience-title">
              <SplitText text="Engineering starts" as="span" />
              <br />
              <SplitText text="with the actual problem." as="span" delay={110} />
            </h2>
            <Reveal as="p" className="lead" delay={200}>
              Practical work with dispatch operations and the settlement data
              behind them.
            </Reveal>
          </div>
          <Reveal as="article" className="experience__entry" delay={160}>
            <span className="mono">July 2025 — present · Tashkent</span>
            <h3>MIM Logistics LLC</h3>
            <p className="experience__role">
              Internal Tooling &amp; Data Analysis
            </p>
            <p>
              Investigated Amazon Relay settlement exports and validated driver
              payout calculations. In 2026, specified automation requirements
              covering record matching, compensation rules, rounding and tenant
              isolation.
            </p>
            <a className="worklink" href="#data">
              Read the investigation →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
