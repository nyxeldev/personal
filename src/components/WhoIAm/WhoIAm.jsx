import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./who-i-am.css";

const FACTS = [
  {
    k: "Education",
    v: "BSc · Information Security Management",
    sub: "International Islamic Academy of Uzbekistan · 2023 — present",
  },
  {
    k: "Foundation",
    v: "Front-End Development (ReactJS)",
    sub: "Najot Ta’lim · July 2023 — May 2024",
  },
  {
    k: "Languages",
    v: "Uzbek · Native",
    sub: "English · Upper-Intermediate / Russian · Pre-Intermediate",
  },
];

export default function WhoIAm() {
  return (
    <section className="section who" id="about" aria-labelledby="about-title">
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">06</span>
          <span>About / trajectory</span>
          <span className="sec-label__bar" />
        </div>
        <div className="who__grid">
          <div className="who__main">
            <h2 className="who__head" id="about-title">
              <SplitText text="From interfaces" as="span" />
              <br />
              <SplitText
                text="to the systems behind them."
                as="span"
                delay={110}
                className="who__head-dim"
              />
            </h2>
            <Reveal as="p" className="who__body" delay={180}>
              React and frontend development were my starting point. Building
              SEASMP took that work into APIs, relational models, Python
              analytics and application security.
            </Reveal>
            <Reveal as="p" className="who__body" delay={240}>
              I’m studying Information Security Management and based in
              Tashkent, Uzbekistan. I’m looking for full-stack and backend
              opportunities where I can keep developing practical data
              engineering skills.
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
