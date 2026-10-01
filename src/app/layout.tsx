import type { Metadata } from "next";
import localFont from "next/font/local";
import { CustomCursorState } from "@/components/ui/CustomCursorState";
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

const siteTitle = "뚝손국밥 | (주)산본에프앤비";
const siteDescription =
  "오래된 국밥집의 깊이를, 현대적인 브랜드로 재해석한 뚝손국밥";

export const metadata: Metadata = {
  // Vercel infers its deployment URL; other hosts can set the public site URL.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: siteTitle,
  description: siteDescription,
  // Prevent the unfinished brand draft from appearing in search results.
  robots: { index: false, follow: false },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    locale: "ko_KR",
    type: "website",
    siteName: "뚝손국밥",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${displayFont.variable}`}
    >
      <body>
        <noscript>
          <style>{`[data-reveal] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <CustomCursorState />
        {children}
      </body>
    </html>
  );
}
