"use client";

import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import "./data-story.css";

const FAULTS = [
  {
    n: "01",
    title: "The row that counts itself",
    body: "Every weekly export ends with an invoice-total row. Sum the column and that row is counted alongside the lines it summarises — the naive gross came out at exactly 2× the real figure, and nothing anywhere raises an error.",
  },
  {
    n: "02",
    title: "The key that isn’t there",
    body: "Payment arrives in two layers. TOUR rows carry base pay but no Load ID; LOAD rows carry fuel and tolls. Joining on Load ID alone silently drops 47% of the payout — no warning, no failed row, just a smaller number.",
  },
  {
    n: "03",
    title: "The 1-in-37 match",
    body: "A 1-of-37 match rate reads like a fleet full of unpaid loads. It was a date-range mismatch between the two files. Without that check, the tool fires 36 false alerts on every single run.",
  },
];

const STATS = [
  { to: 2, suffix: "×", k: "overstated gross before the fix" },
  { to: 47, suffix: "%", k: "of payout dropped by the naive join" },
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
            MIM Logistics runs as an Amazon Relay carrier. Relay’s settlement and
            trip exports are undocumented, and the weekly driver payroll built on
            top of them never reconciled. The assumption in the room was that the
            feed was incomplete. It was not — it was three separate traps, and
            each one failed quietly.
          </Reveal>
        </div>

        {/* ---------- join diagrammasi ---------- */}
        <Reveal className="joinviz" delay={180}>
          <div className="joinviz__scroll">
            <svg
              viewBox="0 0 580 250"
              className="joinviz__svg"
              role="img"
              aria-label="TOUR rows carry base pay but no Load ID; LOAD rows carry fuel and tolls. Joining the two on Load ID alone silently drops 47 percent of the payout."
            >
              <g className="joinviz__wires">
                <path
                  d="M184 56 H232 Q248 56 248 72 V100 Q248 116 264 116 H284"
                  pathLength="100"
                />
                <path
                  d="M184 176 H232 Q248 176 248 160 V132 Q248 116 264 116 H284"
                  pathLength="100"
                />
                <path
                  className="joinviz__broken"
                  d="M384 116 H452"
                  pathLength="100"
                />
              </g>

              <g className="joinviz__flows">
                <path
                  d="M184 56 H232 Q248 56 248 72 V100 Q248 116 264 116 H284"
                  pathLength="100"
                />
                <path
                  d="M184 176 H232 Q248 176 248 160 V132 Q248 116 264 116 H284"
                  pathLength="100"
                  style={{ animationDelay: "0.6s" }}
                />
              </g>

              <g className="joinviz__nodes">
                <g>
                  <rect x="20" y="28" width="164" height="58" rx="6" />
                  <text x="102" y="50" textAnchor="middle">
                    TOUR
                  </text>
                  <text x="102" y="70" textAnchor="middle" className="joinviz__sub">
                    base pay · no Load ID
                  </text>
                </g>
                <g>
                  <rect x="20" y="148" width="164" height="58" rx="6" />
                  <text x="102" y="170" textAnchor="middle">
                    LOAD
                  </text>
                  <text x="102" y="190" textAnchor="middle" className="joinviz__sub">
                    fuel + tolls
                  </text>
                </g>
                <g className="joinviz__join">
                  <rect x="284" y="88" width="100" height="56" rx="6" />
                  <text x="334" y="110" textAnchor="middle">
                    JOIN
                  </text>
                  <text x="334" y="129" textAnchor="middle" className="joinviz__sub">
                    on Load ID
                  </text>
                </g>
                <g className="joinviz__out">
                  <rect x="452" y="88" width="108" height="56" rx="6" />
                  <text x="506" y="120" textAnchor="middle">
                    PAYOUT
                  </text>
                </g>
              </g>

              <g className="joinviz__notes">
                <text x="418" y="104" textAnchor="middle" className="joinviz__loss">
                  −47%
                </text>
                <path className="joinviz__leader" d="M334 144 V196" />
                <text x="334" y="216" textAnchor="middle" className="joinviz__fault">
                  TOUR rows have no key to match on
                </text>
              </g>
            </svg>
          </div>
          <span className="joinviz__hint mono">swipe to follow the join →</span>
        </Reveal>

        {/* ---------- uchta kamchilik ---------- */}
        <div className="faults">
          {FAULTS.map((f, i) => (
            <Reveal className="fault" key={f.n} delay={i * 110}>
              <span className="fault__n mono">{f.n}</span>
              <h3 className="fault__title">{f.title}</h3>
              <p className="fault__body">{f.body}</p>
            </Reveal>
          ))}
        </div>

        {/* ---------- natija ---------- */}
        <Reveal className="datastory__out" delay={120}>
          <span className="datastory__out-label mono">What shipped</span>
          <p className="datastory__body">
            With all three accounted for, I validated payout logic for four
            compensation models against real payroll and reconciled every one to
            zero variance. Then I specified the build around it: fixed-point
            decimals so money never touches a float, compensation rules stored in
            the database rather than hard-coded, and tenant isolation enforced at
            both the ORM and the PostgreSQL RLS layer.
          </p>
        </Reveal>

        <div className="statrow">
          {STATS.map((s, i) => (
            <Reveal className="stat" key={s.k} delay={i * 90}>
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
