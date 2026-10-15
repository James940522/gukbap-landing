import type { Metadata } from "next";

export const DEFAULT_SITE_ORIGIN = "https://www.ttukson.com";
export const SITE_TITLE = "뚝손국밥 | 국밥 메뉴·창업 안내";
export const SITE_DESCRIPTION =
  "한 그릇을 제대로. 뚝손국밥의 대표 메뉴와 브랜드 이야기를 만나고, 창업에 관한 궁금한 점을 가맹 상담으로 확인하세요.";

type SeoEnvironment = Record<string, string | undefined>;

export function getSeoConfig(env: SeoEnvironment = process.env) {
  const rawUrl = env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_ORIGIN;
  let siteUrl: URL;
  try {
    siteUrl = new URL(rawUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL에는 전체 사이트 주소를 설정해주세요.");
  }
  if (!["https:", "http:"].includes(siteUrl.protocol) || siteUrl.username ||
      siteUrl.password || siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL에는 경로·인증 정보 없는 HTTP(S) origin을 설정해주세요.");
  }

  const deployment = env.SEO_DEPLOYMENT_ENV || env.VERCEL_ENV || "development";
  const preview = env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "development";
  const indexable = env.SEO_INDEXABLE === "true" && deployment === "production" && !preview;
  // Explicit publication cannot use a local or temporary deployment URL.
  const temporaryHost = /(^localhost$|\.localhost$|^127\.|^0\.0\.0\.0$|^\[?::1\]?$|\.(?:vercel|netlify)\.app$)/i.test(siteUrl.hostname);
  if (indexable && (siteUrl.protocol !== "https:" || temporaryHost || siteUrl.port)) {
    throw new Error("검색 공개 시 NEXT_PUBLIC_SITE_URL에 정식 HTTPS 도메인을 설정해주세요.");
  }
  return { siteUrl, origin: siteUrl.origin, deployment, indexable };
}

export type SeoConfig = ReturnType<typeof getSeoConfig>;

export function absoluteUrl(path: string, config: SeoConfig = getSeoConfig()) {
  return new URL(path, `${config.origin}/`).toString();
}

export function robotsMetadata(indexable: boolean): Metadata["robots"] {
  return {
    index: indexable,
    follow: true,
    googleBot: { index: indexable, follow: true, "max-image-preview": "large" },
  };
}

export function createPageMetadata({ path, title, description, ready = true }: {
  path: string;
  title: string;
  description: string;
  ready?: boolean;
}, config: SeoConfig = getSeoConfig()): Metadata {
  const url = absoluteUrl(path, config);
  const image = { url: absoluteUrl("/opengraph-image.jpeg", config), width: 1254, height: 1254, alt: "뚝손국밥 로고" };
  return {
    metadataBase: config.siteUrl,
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: robotsMetadata(config.indexable && ready),
    openGraph: {
      title, description, url,
      locale: "ko_KR", type: "website", siteName: "뚝손국밥",
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function verificationMetadata(env: SeoEnvironment = process.env): Pick<Metadata, "verification" | "other"> {
  const google = env.GOOGLE_SITE_VERIFICATION?.trim();
  const naver = env.NAVER_SITE_VERIFICATION?.trim();
  return {
    ...(google ? { verification: { google } } : {}),
    ...(naver ? { other: { "naver-site-verification": naver } } : {}),
  };
}
