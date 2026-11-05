import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "./not-found.css";

export const metadata = {
  title: "404 — Jahongir Hamidov",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="lost">
      <div className="grid-bg" aria-hidden="true" />

      <div className="lost__inner shell">
        <span className="mono lost__code">404</span>

        <h1 className="lost__head">This page could not be found.</h1>

        <p className="lost__sub">
          The address may have changed. Return to the portfolio to explore my
          work.
        </p>

        <Link href="/" className="btn btn--primary lost__back">
          <ArrowLeft size={16} strokeWidth={2} className="btn__arrow" />
          Back to portfolio
        </Link>
      </div>
    </main>
  );
}
