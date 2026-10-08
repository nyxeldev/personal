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

        <h1 className="lost__head">This route doesn&rsquo;t exist.</h1>

        <p className="lost__sub">
          But apparently you found something interesting —
          <br />
          there&rsquo;s nothing broken here, just nothing at this address.
        </p>

        <Link href="/" className="btn btn--primary lost__back">
          <ArrowLeft size={16} strokeWidth={2} className="btn__arrow" />
          Back to system
        </Link>
      </div>
    </main>
  );
}
