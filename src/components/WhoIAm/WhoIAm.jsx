"use client";

import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./who-i-am.css";

const FACTS = [
  {
    k: "Studying",
    v: "Information Security Management",
    sub: "International Islamic Academy of Uzbekistan · 2023—2027",
  },
  {
    k: "Foundation",
    v: "Front-End Development, React",
    sub: "Najot Ta'lim · 2024",
  },
  { k: "Based in", v: "Tashkent, Uzbekistan", sub: "Open to remote work" },
  {
    k: "Languages",
    v: "Uzbek, Tajik, English, Russian",
    sub: "Native · Bilingual · Intermediate",
  },
];

export default function WhoIAm() {
  return (
    <section className="section who" id="about">
      <div className="shell">
        <Reveal className="sec-label">
          <span className="sec-label__num">01</span>
          <span>Who I am</span>
          <span className="sec-label__bar" />
        </Reveal>

        <div className="who__grid">
          <div className="who__main">
            <h2 className="who__head">
              <SplitText text="Building systems" as="span" />
              <SplitText text="that think." as="span" delay={120} className="who__head-dim" />
            </h2>

            <Reveal as="p" className="lead who__lead" delay={200}>
              Full-stack developer moving from frontend toward backend, data and
              intelligent systems.
            </Reveal>

            <Reveal as="p" className="who__body" delay={280}>
              I started where most people see the work — the interface. Then I kept
              following the problem backwards: into the API, into the schema, into the
              pipeline that fed it. That path is the reason I care less about how a screen
              looks on its own and more about whether the number on it is{" "}
              <em>correct</em>.
            </Reveal>

            <Reveal as="p" className="who__body" delay={340}>
              Today I work across the stack — React and Next.js on the surface, Node.js
              and FastAPI underneath, PostgreSQL and Python where the data actually lives.
              Security is not a final checklist in that process; studying information
              security full time has made it the thing I design around first.
            </Reveal>
          </div>

          <div className="who__facts">
            {FACTS.map((f, i) => (
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
