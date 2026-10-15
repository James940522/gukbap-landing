# SEO 적용·운영 안내

적용일: 2026-10-14 (Asia/Seoul)

## 적용 범위와 현재 상태

현재 작업 프로젝트 뚝손국밥에 SEO 기획을 적용했다. 오므라이스·우동·곱도리탕은 참고 프로젝트로 유지했다.
대표 도메인은 사용자가 전달한 `https://www.ttukson.com`이다. GA4는 사용자 결정에 따라 아직 연결하지 않았다.

기본 상태는 `noindex, follow`다. 정식 운영 공개 환경에서만 설정으로 색인을 허용할 수 있다.
실제 매장 CSV는 현재 0건이며 가짜 데이터는 추가하지 않았다. 수익·원가 비교 근거와 가맹절차 최종 자료는
기존 TODO를 유지하고, metadata·JSON-LD에 추가적인 사업 수치나 미확정 정책을 넣지 않았다.

## 완료한 구현

| 영역 | 적용 내용 |
| --- | --- |
| 대표 URL | 공통 origin, HTTPS 공개 검증, `ttukson.com` → `www.ttukson.com` 영구 리다이렉트 |
| Metadata | 메인·매장별 title·description·Canonical·OG/Twitter URL·제목·설명·공유 이미지 |
| 검색 수집 | robots·sitemap 생성. 비색인 환경 sitemap 비움, CSS·JS·이미지 수집 허용 |
| 공개 조건 | 명시적 production opt-in, Vercel preview/development 우선 제외 |
| 매장 정책 | CSV 오류·0건은 `/stores` noindex 및 sitemap 제외 |
| 검색 소유확인 | Google/Naver 환경변수 기반 검증 태그 |
| 구조화 데이터 | 서버 HTML의 Organization·WebSite·WebPage, 안전한 JSON 직렬화 |
| 메인 본문 | 보이는 H1 텍스트와 기존 메뉴 섹션의 접이식 전체 메뉴 29개 |
| 매장 본문 | 지오코딩을 기다리지 않는 서버 OPEN 목록, 클라이언트 좌표 갱신 실패 시 목록 유지 |
| 내부 링크 | 매장 등록 시 메인 섹션의 ‘전체 매장 보기’ 링크 제공 |
| 직접 진입 | 유효 앵커·history·복원된 스크롤·reduced-motion에서 인트로/자동 팝업 생략 |
| 반복 방문 | 세션당 인트로 1회, 스크롤 위치 강제 초기화 제거 |
| 경고 보완 | smooth scroll 선언, fill 배경 이미지의 picture 부모 위치 지정 |
| 이미지 | 팝업의 eager·unoptimized 제거, 적절한 sizes·lazy 이미지 로딩 |
| 측정 준비 | 전화·이메일·길찾기·문의 CTA·상담 성공의 로컬 이벤트 구조 |
| API | `/api/*` 응답의 `X-Robots-Tag: noindex` |

원본 공유 이미지는 1254×1254 크기를 유지했다. Restaurant·FAQ·수익률·설립일 등의 스키마는 추가하지 않았다.

## 배포 설정

[.env.example](/Users/james/Documents/project/ddukson-gukbap/.env.example)에 변수 이름을 기록했다.
운영 공개 자료가 준비된 배포에는 아래 값을 설정하고 재빌드·재배포한다.

```dotenv
NEXT_PUBLIC_SITE_URL=https://www.ttukson.com
SEO_DEPLOYMENT_ENV=production
SEO_INDEXABLE=true
GOOGLE_SITE_VERIFICATION=
NAVER_SITE_VERIFICATION=
```

검증 토큰은 본인의 Google/Naver 속성에서 발급받아 배포 환경에 설정한다. 토큰 없이도 사이트는 실행된다.
Google DNS 소유확인을 쓰는 경우 메타 태그 방식이 필수는 아니다. 태그 구현과 실제 소유확인 완료는 별개다.

개발·시안·staging에서는 `SEO_INDEXABLE=false`를 유지한다. Vercel의 `VERCEL_ENV=preview` 또는
`development`이면 위 opt-in이 있어도 검색 제외 상태다. 다른 호스팅은 `SEO_DEPLOYMENT_ENV`로 배포 종류를 설정한다.
비공개 preview는 호스팅 접근 보호를 사용한다. robots의 수집 차단만으로 검색 제외를 보장하지 않는다.

사이트맵에는 실제 콘텐츠 수정일을 추정해서 넣지 않는다. 운영 공개 시 홈이 포함되며, 유효한 OPEN 매장이
등록되면 `/stores`도 추가된다. CSV 변경은 파일을 포함한 재배포가 필요하다.

호스팅에서 HTTPS 강제 이동·두 도메인 DNS/TLS 연결을 확인한다. 코드의 호스트 리다이렉트는 308이며
경로·쿼리를 보존한다. 호스팅의 `X-Robots-Tag`가 여전히 noindex라면 메타의 index 설정만으로 공개되지 않는다.

## 분석 이벤트

GA4 스크립트·측정 ID·외부 분석 요청은 추가하지 않았다. 현재 이벤트는 브라우저 메모리의 `dataLayer`에
쌓이고 같은 내용의 `ddukson:analytics` CustomEvent를 발생시킨다.

| event | 발생 조건 |
| --- | --- |
| `inquiry_cta_click` | 창업 문의 앵커 또는 모바일 빠른 문의 열기 |
| `phone_click` | 전화 링크 클릭 |
| `email_click` | 이메일 링크 클릭 |
| `directions_click` | 카카오 길찾기·주소 검색 링크 클릭 |
| `generate_lead` | 문의 API가 HTTP 성공과 `ok: true`를 반환한 후 |

payload는 `event`, 허용 목록의 `source`, `/` 또는 `/stores`인 `page_path`만 포함한다.
이름·연락처·희망 지역·문의 원문·외부 링크 주소·query·fragment는 포함하지 않는다.
입력 검증 실패·API 실패·honeypot에는 상담 성공 이벤트를 기록하지 않는다.
Next Link는 native click을 취소하기 전에 capture 단계에서 문의 이동 의도를 수집한다.

GA4 준비 후 측정 ID와 수집 정책을 확정하고 직접 GA4 연동 또는 GTM dataLayer 연결 중 한 경로를 선택한다.
두 경로에서 같은 이벤트를 동시에 전송하지 않도록 한다. 현재 로컬 이벤트는 GA4 수집 완료를 의미하지 않는다.

## 검증 기록

- `pnpm lint`: 통과.
- `node --test tests/*.test.mjs`: SEO 공개 조건·메타데이터·사이트맵·소유확인·분석 개인정보·문의 성공 처리와
  기존 매장·문자 API 회귀 검사를 포함해 31개 통과. 실제 문자·지도 외부 요청은 모의 응답으로 대체.
- 공개 환경 `SEO_DEPLOYMENT_ENV=production SEO_INDEXABLE=true pnpm build --webpack`: production build·TypeScript 통과.
- 기본 환경 `pnpm build --webpack`: production build·TypeScript 통과. 최종 산출물은 기본 비색인 상태로 복원.
- Turbopack `pnpm build`는 최초 통과했으나 후속 CSS 재처리에서 sandbox의 포트 바인딩 제한으로 실패했다.
  webpack으로 동일 소스의 최종 production build를 검증했다. 기본 build 스크립트는 변경하지 않았다.
- 공개 빌드 HTML에서 홈 index/follow, 매장 0건 `/stores` noindex/follow, 페이지별 Canonical·OG/Twitter 제목·URL·이미지,
  서버 JSON-LD를 직접 확인. 사이트맵은 홈만 포함하고 robots의 sitemap 주소도 운영 도메인과 일치.
- 기본 빌드에서는 두 페이지 모두 noindex/follow이며 사이트맵이 비어 있다. metadataBase 경고는 제거됐다.
- 390px 모바일·1440px 데스크톱에서 전체 메뉴 목록 29개, 1열/3열 배치와 가로 넘침 없음 확인.
- 브라우저에서 전체 메뉴 펼침, 빈 매장 상태, `/stores` 문의 링크의 메인 앵커 이동, 인트로 생략 및 console 오류 없음 확인.
- 최종 브라우저 검사에서 smooth-scroll 선언과 배경 이미지 부모 position 경고도 해소했으며 새 페이지의 warn/error 로그 없음 확인.
- 실행 중인 로컬 HTTP 서버에서 `/`, `/stores`, robots·sitemap·OG·매장 API의 200 응답과 API noindex 헤더 확인.
  `ttukson.com` Host의 `/stores?source=seo-check`는 같은 경로·쿼리를 보존한 대표 URL로 308 이동 확인.

## 운영에서 남은 작업

1. 수익·원가 비교 및 뚝손 가맹절차의 공개 자료 확인.
2. 배포 환경의 공개 플래그·검증 토큰 설정과 실제 운영 서버 응답 확인.
3. Google Search Console·네이버 서치어드바이저 소유확인 완료 및 사이트맵 제출·URL 검사.
4. 실제 매장 자료 등록 후 매장 페이지 검색 공개와 지도 실환경 확인.
5. GA4 준비 후 이벤트 연동·수집 확인.
6. 운영 URL의 PageSpeed Insights/Lighthouse 측정 및 영상·폰트 전송 최적화 추가 판단.

새 공유 이미지나 폰트 축소는 필요성과 시각 품질을 운영 측정 후 판단한다. 현재 영상 파일을 재압축하거나
폰트를 교체하지 않았으며 실제 현장 Core Web Vitals 점수를 측정한 결과도 아니다.
