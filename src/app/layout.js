import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE, SITE_URL } from "@/lib/site";
import { LanguageProvider } from "@/hooks/useLanguage";

const sans = Inter({
  subsets: ["latin"],
  // "optional" ga o'tkazildi: "swap" fallback va yuklangan shrift
  // o'rtasidagi kenglik farqi tufayli Hero CTA tugmalarida CLS (layout
  // shift) yaratardi — "optional" esa shriftni faqat tezda tayyor bo'lsa
  // ishlatadi, aks holda fallback bilan qoladi, almashtirmaydi.
  display: "optional",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "optional",
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  title: SITE.title,
  description: SITE.description,
  keywords: [
    "NYXELDEV",
    "full-stack developer",
    "data engineering",
    "FastAPI",
    "Next.js",
    "application security",
  ],
  authors: [{ name: SITE.name, url: SITE_URL }],
  icons: { icon: "/images/favicon.ico" },
  openGraph: {
    title: SITE.title,
    description:
      "Intelligent, data-driven systems. Backend architecture, data engineering and security.",
    url: SITE_URL,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "NYXELDEV — Full-Stack Developer. Data, AI, Security.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description:
      "Intelligent, data-driven systems. Backend architecture, data engineering and security.",
    images: ["/images/og.png"],
  },
};

export const viewport = {
  themeColor: "#2b2d31",
};

// Qidiruv tizimlari (Google) va ijtimoiy tarmoqlar sahifani shaxs
// sifatida to'g'ri o'qishi uchun — da'vo emas, machine-readable fakt.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE_URL,
  jobTitle: "Full-Stack Developer",
  email: `mailto:${SITE.email}`,
  sameAs: [SITE.github, SITE.linkedin, SITE.telegram],
  knowsAbout: [
    "Full-stack development",
    "Data engineering",
    "Application security",
    "Next.js",
    "FastAPI",
    "PostgreSQL",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
