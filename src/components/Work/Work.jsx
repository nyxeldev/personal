"use client";
import { ArrowUpRight, Github } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import { PROOF } from "@/lib/projects";
import useLanguage from "@/hooks/useLanguage";
import "./work.css";

const DETAIL_IDS = [
  "seasmp-architecture",
  "seasmp-attendance",
  "seasmp-model",
  "seasmp-security",
];
const DETAIL_PROOFS = [PROOF.analytics, PROOF.attendance, PROOF.retraining, PROOF.auth];

export default function Work() {
  const { t } = useLanguage();
  const highlights = t("work.seasmp.highlights");
  const stack = t("work.seasmp.stack");
  const details = t("work.seasmp.details");
  const next = t("work.seasmp.next");

  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">01</span>
          <span>{t("work.sectionLabel")}</span>
          <span className="sec-label__bar" />
        </div>
        <h2 className="work__head" id="work-title">
          {t("work.heading")}
        </h2>
        <p className="work__intro lead">{t("work.intro")}</p>
        <Reveal className="cs" id="seasmp">
          <div className="cs__head">
            <div>
              <span className="cs__kicker mono">{t("work.seasmp.kicker")}</span>
              <h3 className="cs__title">{t("work.seasmp.title")}</h3>
              <p className="cs__sub">{t("work.seasmp.subtitle")}</p>
              <p className="cs__meta mono">{t("work.seasmp.meta")}</p>
            </div>
            <a
              className="worklink"
              href="https://github.com/nyxeldev/seasmp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} />
              {t("work.seasmp.source")} <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="cs__highlights" aria-label="Project highlights">
            {highlights.map((h) => (
              <div key={h.k}>
                <span className="mono">{h.k}</span>
                <strong>{h.v}</strong>
                <p>{h.p}</p>
              </div>
            ))}
          </div>
          <div className="cs__overview">
            <div>
              <span className="mono">{t("work.seasmp.problemLabel")}</span>
              <p>{t("work.seasmp.problem")}</p>
            </div>
            <div>
              <span className="mono">{t("work.seasmp.contributionLabel")}</span>
              <p>{t("work.seasmp.contribution")}</p>
            </div>
          </div>
          <div className="stackmap" aria-label="SEASMP service structure">
            {stack.map((row) => (
              <div className="stackmap__row" key={row.tier}>
                <span className="stackmap__tier mono">{row.tier}</span>
                <span className="stackmap__cell">{row.text}</span>
              </div>
            ))}
          </div>
          <div className="cs__details">
            {details.map((d, i) => (
              <section
                className="cs__detail"
                id={DETAIL_IDS[i]}
                key={DETAIL_IDS[i]}
                aria-labelledby={`${DETAIL_IDS[i]}-title`}
              >
                <h4 id={`${DETAIL_IDS[i]}-title`}>{d.title}</h4>
                <p>{d.body}</p>
                <a
                  className="worklink"
                  href={DETAIL_PROOFS[i]}
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
            <span className="find__label mono">{t("work.seasmp.testingLabel")}</span>
            <div className="find__body">
              <p>{t("work.seasmp.testing")}</p>
              <a
                className="worklink"
                href={PROOF.ci}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("work.seasmp.inspectWorkflow")}
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <details className="next">
            <summary className="next__label mono">
              {t("work.seasmp.nextLabel")} <span aria-hidden="true">+</span>
            </summary>
            <ul className="next__list">
              {next.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
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
            <div className="mini__frame" aria-hidden="true">
              <span className="mini__frame-dot" />
              <span className="mini__frame-dot" />
              <span className="mini__frame-dot" />
            </div>
            <div className="mini__media-crop">
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
                    alt={t("work.ielts.imgAlt")}
                  />
                </picture>
              </Parallax>
            </div>
          </a>
          <div className="mini__body">
            <span className="cs__kicker mono">{t("work.ielts.kicker")}</span>
            <h3 className="mini__title">{t("work.ielts.title")}</h3>
            <p className="mini__text">{t("work.ielts.text")}</p>
            <div className="mini__chips">
              {["Next.js", "React", "Ant Design", "REST API"].map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
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
                {t("work.ielts.liveDemo")}
                <ArrowUpRight size={15} />
              </a>
              <a
                className="worklink"
                href={PROOF.ielts}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("work.ielts.practiceImplementation")}
                <ArrowUpRight size={15} />
              </a>
            </div>
            <p className="mini__caption">{t("work.ielts.caption")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
