import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

// Official WOFF2 with full Hangul coverage, so future headlines need no new subset.
const displayFont = localFont({
  src: "../../public/fonts/MaruBuri-SemiBold.woff2",
  variable: "--font-display",
  weight: "600",
  display: "swap",
  fallback: ["Batang", "serif"],
});

export const metadata: Metadata = {
  title: "뚝손국밥 | 한 그릇을 제대로",
  description: "뜨겁게 끓이고 든든하게 내놓는 뚝손국밥 공식 홈페이지입니다.",
  // Prevent the unfinished brand draft from appearing in search results.
  robots: { index: false, follow: false },
  openGraph: {
    title: "뚝손국밥 | 한 그릇을 제대로",
    description: "한 그릇에 담은 깊은 맛. 뚝손국밥의 이야기를 만나보세요.",
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
      <body>{children}</body>
    </html>
  );
}
