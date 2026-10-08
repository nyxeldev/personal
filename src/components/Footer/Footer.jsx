"use client";

import { ArrowUp } from "lucide-react";
import BuildLog from "./BuildLog";
import "./footer.css";

const LINKS = [
  { label: "GitHub", href: "https://github.com/nyxeldev" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/iamhamidov/" },
  { label: "Telegram", href: "https://t.me/nyxeldev" },
  { label: "Résumé", href: "/files/Resume.pdf" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="shell foot__inner">
        <div className="foot__left">
          <span className="foot__name">Jahongir Hamidov</span>
          <span className="foot__note mono">
            Intelligent systems · Tashkent, UZ · © {year}
          </span>
          <BuildLog />
        </div>

        <nav className="foot__links" aria-label="Elsewhere">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="foot__top" aria-label="Back to top">
          <ArrowUp size={15} strokeWidth={1.8} />
        </a>
      </div>
    </footer>
  );
}
