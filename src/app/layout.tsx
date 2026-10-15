import type { Metadata } from "next";
import localFont from "next/font/local";
import { CustomCursorState } from "@/components/ui/CustomCursorState";
import { SiteAnalytics } from "@/components/seo/SiteAnalytics";
import { getSeoConfig, robotsMetadata, SITE_DESCRIPTION, SITE_TITLE, verificationMetadata } from "@/lib/seo";
import "./globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

// Use the smaller OTF from the user-provided MaruBuri family for display text.
const displayFont = localFont({
  src: "../../public/fonts/maruburi/OTF/MaruBuri-Bold.otf",
  variable: "--font-display",
  weight: "700",
  display: "swap",
  fallback: ["Batang", "serif"],
});

export const metadata: Metadata = {
  metadataBase: getSeoConfig().siteUrl,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: robotsMetadata(getSeoConfig().indexable),
  ...verificationMetadata(),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "ko_KR",
    type: "website",
    siteName: "뚝손국밥",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${pretendard.variable} ${displayFont.variable}`}
    >
      <body>
        <noscript>
          <style>{`[data-reveal] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <CustomCursorState />
        <SiteAnalytics />
        {children}
      </body>
    </html>
  );
}
