import { ArrowUpRight, Github } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import { PROOF } from "@/lib/projects";
import "./work.css";

const DETAILS = [
  {
    id: "seasmp-architecture",
    title: "Architecture",
    body: "Next.js dashboards call a Fastify core API. Python analytics runs in a separate FastAPI service, reached through synchronous HTTP with an internal key. PostgreSQL stores application data; Redis supports short-lived state; Celery schedules analytics tasks.",
    proof: PROOF.analytics,
    label: "Service contract",
  },
  {
    id: "seasmp-attendance",
    title: "Attendance",
    body: "QR attendance uses a five-minute Redis token containing a course and lesson date. The API checks the authenticated student’s active enrollment and existing attendance, then deletes the token after creating a record. This does not establish physical presence or prevent forwarding.",
    proof: PROOF.attendance,
    label: "Attendance service",
  },
  {
    id: "seasmp-model",
    title: "Data & ML",
    body: "An ETL pipeline feeds a Random Forest with balanced class weights. Celery schedules nightly rescoring and monthly retraining. Training records AUC and replaces the active artifact; the retraining task logs the comparison, including degradation. Conditional promotion is a next step.",
    proof: PROOF.retraining,
    label: "Retraining behavior",
  },
  {
    id: "seasmp-security",
    title: "Security",
    body: "The API includes four-role access control, service-level ownership checks, TOTP 2FA, and audit logging on authentication and selected mutations. JWT access tokens are paired with hashed, opaque refresh tokens: exchanging a refresh token removes its stored predecessor. The global request limit is keyed by client IP.",
    proof: PROOF.auth,
    label: "Authentication implementation",
  },
];

export default function Work() {
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">01</span>
          <span>Selected work</span>
          <span className="sec-label__bar" />
        </div>
        <h2 className="work__head" id="work-title">
          Systems, with the details.
        </h2>
        <p className="work__intro lead">What I built, why it works this way, and where it goes next.</p>
        <Reveal className="cs" id="seasmp">
          <div className="cs__head">
            <div>
              <span className="cs__kicker mono">
                Education · Analytics · Security
              </span>
              <h3 className="cs__title">SEASMP</h3>
              <p className="cs__sub">
                Smart Education Analytics &amp; Security Monitoring Platform
              </p>
              <p className="cs__meta mono">
                Solo developer · May 2026 — present · In development
              </p>
            </div>
            <a
              className="worklink"
              href="https://github.com/nyxeldev/seasmp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} />
              Source <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="cs__highlights" aria-label="Project highlights">
            <div><span className="mono">Application</span><strong>Four user roles</strong><p>Dashboards shaped around each workflow.</p></div>
            <div><span className="mono">Intelligence</span><strong>Python analytics</strong><p>ETL, risk scoring and scheduled training.</p></div>
            <div><span className="mono">Trust</span><strong>Security by design</strong><p>Ownership checks, TOTP and audit events.</p></div>
          </div>
          <div className="cs__overview">
            <div>
              <span className="mono">Problem</span>
              <p>
                Students, teachers and administrators need different views of
                attendance, course performance and emerging student risk.
              </p>
            </div>
            <div>
              <span className="mono">My contribution</span>
              <p>
                I built the role-specific web dashboards, core API, analytics
                pipeline and security monitoring features in a monorepo.
              </p>
            </div>
          </div>
          <div className="stackmap" aria-label="SEASMP service structure">
            {[
              ["Client", "Next.js dashboards"],
              ["Core", "Fastify · Prisma · JWT access / opaque refresh"],
              ["Analytics", "FastAPI · Python · Celery"],
              ["Data", "PostgreSQL · Redis"],
            ].map(([tier, text]) => (
              <div className="stackmap__row" key={tier}>
                <span className="stackmap__tier mono">{tier}</span>
                <span className="stackmap__cell">{text}</span>
              </div>
            ))}
          </div>
          <div className="cs__details">
            {DETAILS.map((d) => (
              <section
                className="cs__detail"
                id={d.id}
                key={d.id}
                aria-labelledby={`${d.id}-title`}
              >
                <h4 id={`${d.id}-title`}>{d.title}</h4>
                <p>{d.body}</p>
                <a
                  className="worklink"
                  href={d.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {d.label}
                  <ArrowUpRight size={14} />
                </a>
              </section>
            ))}
          </div>
          <div className="find" id="seasmp-testing">
            <span className="find__label mono">Testing &amp; delivery</span>
            <div className="find__body">
              <p>
                The CI workflow defines Jest, Vitest, PostgreSQL/Redis
                integration, pytest and Playwright jobs before Docker image
                publishing to GHCR. This describes the configured checks, not a
                claim that every current run passes.
              </p>
              <a
                className="worklink"
                href={PROOF.ci}
                target="_blank"
                rel="noopener noreferrer"
              >
                Inspect the workflow
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <details className="next">
            <summary className="next__label mono">Limits &amp; next steps <span aria-hidden="true">+</span></summary>
            <ul className="next__list">
              <li>
                My recorded data snapshot contained 191 enrollments and six
                dropout events. That is too little to establish predictive
                reliability; the counts are a project snapshot, not a live
                metric.
              </li>
              <li>
                Evaluate candidate models before replacing the active artifact.
                Compare on a consistent validation set and promote only when the
                acceptance criteria are met.
              </li>
              <li>
                Add explicit HTTP timeout budgets and failure tests between
                services. Separation reduces coupling; it does not guarantee
                failure isolation.
              </li>
              <li>
                Test QR consumption under concurrency and clarify the classroom
                flow. The current course token is not a proof of physical
                presence.
              </li>
            </ul>
          </details>
        </Reveal>
        <Reveal className="mini" id="ielts">
          <a
            className="mini__media"
            href="https://speakready.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open IELTS Speaking Practice live demo"
          >
            <Parallax amount={26}>
              <picture>
                <source
                  srcSet="/images/ielts-640.webp 640w, /images/ielts-1100.webp 1100w"
                  sizes="(max-width: 920px) 90vw, 40vw"
                  type="image/webp"
                />
                <img
                  src="/images/ielts-1100.webp"
                  width="1100"
                  height="688"
                  loading="lazy"
                  decoding="async"
                  alt="IELTS Speaking Practice live landing page with Part 1, Part 2 and Part 3 choices"
                />
              </picture>
            </Parallax>
          </a>
          <div className="mini__body">
            <span className="cs__kicker mono">Frontend foundation</span>
            <h3 className="mini__title">IELTS Speaking Practice</h3>
            <p className="mini__text">
              A practice interface for moving through IELTS speaking questions.
              I built the Next.js frontend, speaking-part navigation, browser
              speech controls and REST API integration.
            </p>
            <p className="mini__text">
              The public frontend includes loading and error handling. Practice
              depends on an external question API; backend ownership and
              availability are not established by this repository.
            </p>
            <div className="mini__chips">
              {["Next.js", "React", "Ant Design", "REST API"].map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div className="mini__links">
              <a
                className="worklink"
                href="https://speakready.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live demo
                <ArrowUpRight size={15} />
              </a>
              <a
                className="worklink"
                href={PROOF.ielts}
                target="_blank"
                rel="noopener noreferrer"
              >
                Practice implementation
                <ArrowUpRight size={15} />
              </a>
            </div>
            <p className="mini__caption">
              Live landing-page capture · October 2026
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
