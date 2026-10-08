"use client";

import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import "./data-story.css";

const STATS = [
  { to: 47, suffix: "%", k: "of payout unaccounted for" },
  { to: 4, suffix: "", k: "compensation models validated" },
  { to: 0, suffix: "", k: "variance against real payroll" },
];

export default function DataStory() {
  return (
    <section className="section datastory" id="data">
      <div className="shell">
        <Reveal className="sec-label">
          <span className="sec-label__num">04</span>
          <span>Data engineering</span>
          <span className="sec-label__bar" />
        </Reveal>

        <div className="datastory__top">
          <h2 className="datastory__head">
            <SplitText text="The data was wrong." as="span" />
            <SplitText
              text="I found out why."
              as="span"
              delay={140}
              className="datastory__head-accent"
            />
          </h2>

          <Reveal as="p" className="datastory__intro" delay={240}>
            At MIM Logistics I worked with Amazon Relay data. The payout numbers never
            reconciled, and the assumption in the room was that the source feed was
            incomplete. It was not.
          </Reveal>
        </div>

        {/* ---------- join diagrammasi ---------- */}
        <Reveal className="joinviz" delay={180}>
          <svg viewBox="0 0 560 230" className="joinviz__svg" role="img"
            aria-label="Tour and Load tables joined to produce Payout; a date-range mismatch in the join dropped 47 percent of rows.">
            {/* chiziqlar */}
            <g className="joinviz__wires">
              <path d="M140 56 H195 Q210 56 210 71 V91 Q210 106 225 106 H250" pathLength="100" />
              <path d="M140 156 H195 Q210 156 210 141 V121 Q210 106 225 106 H250" pathLength="100" />
              <path className="joinviz__broken" d="M350 106 H430" pathLength="100" />
            </g>

            {/* oqim */}
            <g className="joinviz__flows">
              <path d="M140 56 H195 Q210 56 210 71 V91 Q210 106 225 106 H250" pathLength="100" />
              <path d="M140 156 H195 Q210 156 210 141 V121 Q210 106 225 106 H250"
                pathLength="100" style={{ animationDelay: "0.6s" }} />
            </g>

            {/* tugunlar */}
            <g className="joinviz__nodes">
              <g>
                <rect x="20" y="32" width="120" height="48" rx="6" />
                <text x="80" y="56" dominantBaseline="central" textAnchor="middle">TOUR</text>
              </g>
              <g>
                <rect x="20" y="132" width="120" height="48" rx="6" />
                <text x="80" y="156" dominantBaseline="central" textAnchor="middle">LOAD</text>
              </g>
              <g className="joinviz__join">
                <rect x="250" y="82" width="100" height="48" rx="6" />
                <text x="300" y="106" dominantBaseline="central" textAnchor="middle">JOIN</text>
              </g>
              <g className="joinviz__out">
                <rect x="430" y="82" width="110" height="48" rx="6" />
                <text x="485" y="106" dominantBaseline="central" textAnchor="middle">PAYOUT</text>
              </g>
            </g>

            {/* belgilar */}
            <g className="joinviz__notes">
              <path className="joinviz__leader" d="M300 130 V176" pathLength="100" />
              <text x="300" y="196" textAnchor="middle" className="joinviz__fault">
                date-range mismatch
              </text>
              <text x="390" y="92" textAnchor="middle" className="joinviz__loss">
                −47%
              </text>
            </g>
          </svg>
        </Reveal>

        {/* ---------- natija ---------- */}
        <div className="datastory__grid">
          <Reveal as="p" className="datastory__body" delay={120}>
            The join between <code>TOUR</code> and <code>LOAD</code> was matching on a
            date range whose boundaries did not line up between the two systems. Rows that
            should have paired silently dropped, and the payout total came out short —
            consistently, which is exactly why nobody suspected the join.
          </Reveal>

          <Reveal as="p" className="datastory__body" delay={180}>
            Once the boundary was corrected, I validated four compensation models against
            real payroll and reconciled them to zero variance. The fix was small. Finding
            it meant not trusting the number that looked plausible.
          </Reveal>
        </div>

        <div className="statrow">
          {STATS.map((s, i) => (
            <Reveal className="stat" key={s.k} delay={i * 110}>
              <span className="stat__n">
                <Counter to={s.to} suffix={s.suffix} />
              </span>
              <span className="stat__k">{s.k}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
