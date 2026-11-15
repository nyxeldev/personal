"use client";
import { ArrowUp } from "lucide-react";
import BuildLog from "./BuildLog";
import useLanguage from "@/hooks/useLanguage";
import "./footer.css";

const LINK_KEYS = ["github", "linkedin", "telegram", "resume"];
const HREFS = {
  github: "https://github.com/nyxeldev",
  linkedin: "https://www.linkedin.com/in/iamhamidov/",
  telegram: "https://t.me/nyxeldev",
  resume: "/files/Resume.pdf",
};

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const links = t("footer.links");

  return (
    <footer className="foot">
      <div className="shell foot__inner">
        <div className="foot__left">
          <span className="foot__name">{t("footer.name")}</span>
          <span className="foot__note mono">
            {t("footer.note")} · © {year}
          </span>
          <BuildLog />
        </div>

        <nav className="foot__links" aria-label="Elsewhere">
          {LINK_KEYS.map((key) => (
            <a
              key={key}
              href={HREFS[key]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links[key]}
            </a>
          ))}
        </nav>

        <a href="#top" className="foot__top" aria-label={t("footer.backToTop")}>
          <ArrowUp size={15} strokeWidth={1.8} />
        </a>
      </div>
    </footer>
  );
}
