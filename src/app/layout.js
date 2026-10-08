import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { ModeProvider } from "@/hooks/useMode";

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

// Boshqa domenga qo'yilsa NEXT_PUBLIC_SITE_URL bilan almashtiriladi
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://nyxeldev.pro";

export const metadata = {
  metadataBase: new URL(SITE),
  title: "Jahongir Hamidov — Full-Stack Developer",
  description:
    "I build intelligent, data-driven systems with a focus on reliable backend architecture and security.",
  keywords: [
    "Jahongir Hamidov",
    "full-stack developer",
    "data engineering",
    "FastAPI",
    "Next.js",
    "application security",
  ],
  authors: [{ name: "Jahongir Hamidov" }],
  icons: { icon: "/images/favicon.ico" },
  openGraph: {
    title: "Jahongir Hamidov — Full-Stack Developer",
    description:
      "Intelligent, data-driven systems. Backend architecture, data engineering and security.",
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
    title: "Jahongir Hamidov — Full-Stack Developer",
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

// Sahifa chizilishidan oldin tema va rejimni qo'yadi — aks holda qorong'i
// temada oq lip-lip bo'ladi, rejim esa bir lahza noto'g'ri kontent ko'rsatadi
const bootScript = `
try {
  var t = localStorage.getItem("theme") || "light";
  var m = localStorage.getItem("mode") || "recruiter";
  document.documentElement.classList.add(t + "-theme", "mode-" + m);
} catch (e) {
  document.documentElement.classList.add("light-theme", "mode-recruiter");
}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <ThemeProvider>
          <ModeProvider>{children}</ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
