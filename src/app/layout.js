import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { SITE, SITE_URL } from "@/lib/site";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE.title,
  description: SITE.description,
  keywords: [
    "Jahongir Hamidov",
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
        alt: "Jahongir Hamidov — Full-Stack Developer. Data, AI, Security.",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
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

// Sahifa chizilishidan oldin temani qo'yadi, aks holda qorong'i
// temada oq lip-lip bo'ladi
const bootScript = `
try {
  var t = localStorage.getItem("theme") || "light";
  document.documentElement.classList.add(t + "-theme");
} catch (e) {
  document.documentElement.classList.add("light-theme");
}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
