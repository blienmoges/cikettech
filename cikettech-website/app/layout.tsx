import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PerformanceMonitor from "./components/PerformanceMonitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cikettech.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CIKETTECH | Intelligent Technology Made in Ethiopia",
  description:
    "CIKETTECH designs and manufactures intelligent electronic systems for modern infrastructure.",
  openGraph: {
    type: "website",
    siteName: "CIKETTECH",
    title: "CIKETTECH | Intelligent Technology Made in Ethiopia",
    description:
      "CIKETTECH designs and manufactures intelligent electronic systems for modern infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIKETTECH | Intelligent Technology Made in Ethiopia",
    description:
      "CIKETTECH designs and manufactures intelligent electronic systems for modern infrastructure.",
  },
};

// Runs before paint so the admin portal never flashes the wrong theme on load.
const themeInitScript = `
(function () {
  try {
    var theme = localStorage.getItem("cikettech_admin_theme");
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body><PerformanceMonitor />{children}</body>
    </html>
  );
}
