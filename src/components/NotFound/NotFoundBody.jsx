"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import useLanguage from "@/hooks/useLanguage";

export default function NotFoundBody() {
  const { t } = useLanguage();
  return (
    <main className="lost">
      <div className="grid-bg" aria-hidden="true" />

      <div className="lost__inner shell">
        <span className="mono lost__code">404</span>

        <h1 className="lost__head">{t("notFound.heading")}</h1>

        <p className="lost__sub">{t("notFound.sub")}</p>

        <Link href="/" className="btn btn--primary lost__back">
          <ArrowLeft size={16} strokeWidth={2} className="btn__arrow" />
          {t("notFound.back")}
        </Link>
      </div>
    </main>
  );
}
