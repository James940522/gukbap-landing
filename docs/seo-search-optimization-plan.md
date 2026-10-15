# SEO 점검 결과 및 검색 최적화 기획

점검일: 2026-10-14 (Asia/Seoul)

이 문서는 최초 점검·기획 당시의 상태를 보존한다. 이후 확정된 운영 도메인과 구현·검증 결과는
[SEO 적용·운영 안내](/Users/james/Documents/project/ddukson-gukbap/docs/seo-implementation.md)에 기록한다.

## 1. 결론과 범위

뚝손국밥은 브랜드 시안의 검색 노출을 막는 `noindex, nofollow` 상태다. 이는 의도적인 공개 전 설정이다. 정식 공개 시 대표 도메인과 색인 정책을 함께 확정하고, Canonical·사이트맵·검색엔진 등록을 연결하는 작업이 가장 먼저 필요하다.

현재 작업은 **설정 확인과 기획**이다. 서비스 코드, 색인 허용 설정, 도메인, 배포 환경, 검색엔진 계정은 변경하지 않았다. 기존 README·SEO 문서는 현재 구현을 비교하는 자료로 사용했으며, 문서 안의 배포·등록 절차를 별도 실행 요청으로 취급하지 않았다.

점검 대상은 현재 작업 프로젝트 `ddukson-gukbap`과 사용자가 언급한 `omurice-landing`, `udon-landing`, `gopdoritang`이다. 뚝손은 소스와 production build의 HTML까지 확인했고, 나머지 세 프로젝트는 소스·관련 문서·이미지 파일을 확인했다. 실제 운영 서버의 HTTP 응답, 호스팅 설정, Google Search Console·네이버 서치어드바이저의 등록·색인 현황은 미확인이다.

## 2. 네 프로젝트의 현재 설정

| 항목 | 뚝손국밥 | 오므라이스 | 우동 | 곱도리탕 |
| --- | --- | --- | --- | --- |
| Next.js | 16.3.6 | 16.0.8 | 16.0.8 | 16.2.4 |
| 대표 URL | `NEXT_PUBLIC_SITE_URL` 사용, 이번 빌드에서는 미설정 | 코드 상수 `https://www.todayomurice.com` | 코드 상수 `https://todayudon.com` | 환경변수 우선, 기본 `https://www.simgopdoritang.com` |
| title / description | 있음 | 있음 | 있음 | 있음 |
| Canonical | 없음 | 있음 | 있음 | 있음 |
| 색인 메타 | 전체 `noindex, nofollow` | Vercel preview만 차단 | Vercel preview만 차단 | Vercel preview만 차단 |
| robots.txt | 구현 없음 | 있음 | 있음 | 있음 |
| sitemap.xml | 구현 없음 | 홈 1개 | 홈 1개 | 홈 1개 |
| OG / Twitter | 파일 기반 자동 출력 확인 | 있음 | 있음 | 있음 |
| Google / Naver 소유확인 태그 | 구현 없음 | 환경변수 연결 | 환경변수 연결 | 환경변수 연결 |
| JSON-LD | 없음 | Organization·WebSite·WebPage·Breadcrumb·FAQ | Organization·FAQ | Organization·Brand·WebSite·WebPage·Breadcrumb |

대표 URL은 **코드가 가리키는 주소**이며 실제 운영 상태를 의미하지 않는다. 소유확인 태그의 구현이나 환경변수 존재도 검색엔진 등록 완료를 의미하지 않는다. robots.txt·사이트맵의 부재만으로 색인이 불가능한 것은 아니며, 뚝손의 현재 명시적 제외 설정은 `noindex`다. [Google 색인 메타 지침](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), [Google SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

설정 근거:

- 뚝손: [layout.tsx](/Users/james/Documents/project/ddukson-gukbap/src/app/layout.tsx:22), [stores/page.tsx](/Users/james/Documents/project/ddukson-gukbap/src/app/stores/page.tsx:9), [README 공개 안내](/Users/james/Documents/project/ddukson-gukbap/README.md:69).
- 오므라이스: [대표 URL](/Users/james/Documents/project/omurice-landing/src/shared/config/site.ts:9), [robots.ts](/Users/james/Documents/project/omurice-landing/src/app/robots.ts:10), [메인 JSON-LD](/Users/james/Documents/project/omurice-landing/src/app/page.tsx:83).
- 우동: [대표 URL](/Users/james/Documents/project/udon-landing/src/shared/config/site.ts:9), [sitemap.ts](/Users/james/Documents/project/udon-landing/src/app/sitemap.ts:12), [메인 JSON-LD](/Users/james/Documents/project/udon-landing/src/app/page.tsx:98).
- 곱도리탕: [대표 URL](/Users/james/Documents/project/gopdoritang/src/shared/config/site.ts:1), [metadata.ts](/Users/james/Documents/project/gopdoritang/src/application/config/metadata.ts:12), [structured-data.ts](/Users/james/Documents/project/gopdoritang/src/application/config/structured-data.ts:3).

## 3. 뚝손국밥의 구체적인 발견

| 우선순위 | 확인된 상태 | 기획 방향 |
| --- | --- | --- |
| P0 | 루트 metadata의 `noindex, nofollow`를 `/`와 `/stores` 모두 상속 | 정식 공개 환경에서만 색인 허용. 시안·preview는 제외 유지 |
| P0 | 도메인이 없으면 `metadataBase`가 undefined | 정식 운영 URL을 단일 설정으로 관리하고 공개 빌드에서 검증 |
| P0 | Canonical·robots·sitemap·검증 태그 없음 | 같은 대표 URL과 공개 정책으로 일관되게 생성 |
| P0 | 수익구조·원가율 근거, 뚝손 가맹절차에 확인 TODO | 공개 전 근거·기간·적용조건 확인. 미확정 수치는 SEO 카피와 JSON-LD로 확대하지 않음 |
| P1 | `/stores`의 title·description은 별도지만 OG/Twitter는 홈 문구 상속 | 페이지별 Canonical·공유 제목·설명·URL 구성 |
| P1 | 매장 CSV는 헤더만 있고 실제 매장 0건 | 매장 자료 확보까지 `/stores`는 검색 대상에서 제외 |
| P1 | 매장 목록은 클라이언트 fetch 후 표시 | 실매장 도입 시 목록은 서버 HTML, 지도·검색은 클라이언트 처리 |
| P1 | 메뉴 탭은 선택 카테고리·하위 그룹만 마운트 | 기존 메뉴 섹션에 전체 메뉴명과 확정 설명을 최초 HTML로 제공 |
| P1 | 인트로가 앵커 진입·이력 이동도 최상단으로 돌리고 스크롤 잠금 | `/#menu`, `/#inquiry` 진입 위치와 정보 접근 보존 |
| P2 | H1은 이미지 로고이며 브랜드명 alt 있음 | 브랜드와 페이지 목적을 텍스트로 보강. H1이 없다는 오류로 분류하지 않음 |
| P2 | 분석 도구·상담 완료 추적 구현을 찾지 못함 | 검색 노출·클릭·유입·상담 성공을 연결해 측정 |

근거: [색인·도메인](/Users/james/Documents/project/ddukson-gukbap/src/app/layout.tsx:26), [메뉴 선택 렌더링](/Users/james/Documents/project/ddukson-gukbap/src/components/ui/MenuGallery.tsx:250), [매장 fetch](/Users/james/Documents/project/ddukson-gukbap/src/components/sections/StoreMapSection.tsx:53), [실매장 CSV](/Users/james/Documents/project/ddukson-gukbap/data/stores.csv:1), [인트로 위치 초기화](/Users/james/Documents/project/ddukson-gukbap/src/components/intro/VideoIntro.tsx:65), [Hero H1](/Users/james/Documents/project/ddukson-gukbap/src/components/sections/GateHeroSection.tsx:19).

이미 갖춘 장점은 유지한다. 메인페이지는 HTML 본문을 렌더하며, 한국어 `lang`, `next/image`, 로컬 폰트, 아이콘, JavaScript 비활성 시 Reveal 표시가 구현돼 있다. 수익구조 섹션도 이미지 외에 HTML 제목·설명·수치를 제공한다. 전체 사이트를 “JavaScript 실행 전 내용이 없는 사이트”로 판단하면 부정확하다. [page.tsx](/Users/james/Documents/project/ddukson-gukbap/src/app/page.tsx:34), [layout.tsx](/Users/james/Documents/project/ddukson-gukbap/src/app/layout.tsx:46), [수익구조 HTML](/Users/james/Documents/project/ddukson-gukbap/src/components/sections/ProfitStructureSection.tsx:79)

### Production build HTML 확인 결과

| 항목 | `/` | `/stores` |
| --- | --- | --- |
| title | 뚝손국밥 \| (주)산본에프앤비 | 가맹점 찾기 \| 뚝손국밥 |
| robots | noindex, nofollow | noindex, nofollow |
| canonical | 없음 | 없음 |
| OG / Twitter 제목 | 홈 제목 | 홈 제목 상속 |
| OG / Twitter 이미지 기준 URL | `http://localhost:3000` | `http://localhost:3000` |
| JSON-LD | 없음 | 없음 |
| H1 | 로고 이미지, alt=뚝손국밥 | 가까운 뚝손국밥을 찾아보세요 |

이는 **이번 로컬 빌드의 결과**다. 실제 배포 이미지 URL이 localhost라는 결론은 아니다. 다만 운영 URL을 명시하지 않으면 환경에 따라 잘못된 공유 URL이 생성될 수 있으므로 공개 빌드 검증이 필요하다.

## 4. 검색 목적과 콘텐츠 기획

초기에는 브랜드 검색과 가맹 문의에 집중한다. 아래는 검색 의도에 따른 후보이며 검색량·난이도·노출 순위를 측정한 결과가 아니다.

| 검색 의도 | 후보 검색어 | 연결할 기존 콘텐츠 | 전환 |
| --- | --- | --- | --- |
| 공식 브랜드 확인 | 뚝손국밥, 뚝손 국밥 | Hero·브랜드 소개·회사 정보 | 메뉴 확인·창업 문의 |
| 창업 검토 | 뚝손국밥 창업, 국밥 창업, 국밥 프랜차이즈 | 조리 방식·창업 절차·본사 지원 | 가맹 상담 |
| 메뉴 확인 | 뚝손국밥 메뉴, 뚝손국밥 누룽지순대국밥 | 기존 메뉴·누룽지 섹션 | 매장 확인 |
| 가까운 매장 확인 | 뚝손국밥 매장, 지역명 + 실제 지점명 | 메인 매장 섹션·준비된 `/stores` | 전화·길찾기 |

메뉴 후보는 현재 [브랜드 제공 메뉴 데이터](/Users/james/Documents/project/ddukson-gukbap/src/data/menus.ts:70)에 있는 이름만 사용한다. 본사 주소를 근거로 특정 지역 음식점·맛집 검색어를 만들지 않는다.

메인페이지 metadata 초안:

```text
title: 뚝손국밥 | 국밥 메뉴·창업 안내
description: 한 그릇을 제대로. 뚝손국밥의 대표 메뉴와 브랜드 이야기를 만나고, 창업 절차와 가맹 상담을 확인하세요.
```

가맹절차 공개가 준비되지 않았다면 description의 해당 표현은 “창업 문의”로 줄인다. 대형 감성 카피는 유지하면서 실제 읽을 수 있는 브랜드 소개 한 문장, 메뉴명, 창업 안내 제목을 메인 섹션 안에 보강한다. 화면 밖에 검색어를 나열하는 방식은 사용하지 않는다.

페이지마다 짧고 내용에 맞는 제목·설명을 쓰고, meta keywords 추가보다 실제 본문을 우선한다. Google은 meta keywords를 검색에 사용하지 않으며 제목·검색 설명은 페이지 내용에 따라 다르게 표시할 수 있다. [Google SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

### 검색 대상 URL

| URL | 초기 정책 | 준비 이후 정책 |
| --- | --- | --- |
| `/` | 시안 단계 noindex | 정식 공개 시 index, follow + 자기 URL Canonical |
| `/stores` | noindex, follow + 사이트맵 제외 | 실제 매장 정보·서버 HTML·내부 링크 확보 후 index + `/stores` Canonical |
| `/#menu`, `/#inquiry`, `/#stores` | 홈 내 이동 지점 | 별도 페이지처럼 사이트맵에 추가하지 않음 |
| `/api/leads`, `/api/stores` | 검색 대상 아님 | 사이트맵 제외, 필요 시 API 응답 `X-Robots-Tag: noindex` |

`/stores`는 현재 존재하는 공개 기능 페이지다. 유지한다면 홈과 다른 사용 목적에 맞는 정보·메타데이터·링크를 제공한다. 초기에는 메인의 `#stores`를 기본 진입점으로 유지할 수 있다. 매장 페이지가 준비됐을 때 “전체 매장 보기” 링크를 추가한다. 브랜드·메뉴·창업 콘텐츠를 SEO 목적만으로 별도 route에 복제하지 않는다.

현재 [navigation](/Users/james/Documents/project/ddukson-gukbap/src/data/site.ts:24)은 `#stores`로 연결하지만 [매장 관리 README](/Users/james/Documents/project/ddukson-gukbap/data/README.md:80)는 `/stores` 연결이라고 설명한다. 공개 정책 구현 시 문서도 실제 코드와 맞춘다.

## 5. 기술 설정 명세

### 대표 URL과 공개 환경

- 기존 `NEXT_PUBLIC_SITE_URL` 이름을 유지해 운영 origin을 한 곳에서 읽는다. 다른 브랜드 도메인을 기본값으로 복사하지 않는다.
- 운영 공개 빌드는 HTTPS origin, 경로·쿼리·fragment 없음, localhost·임시 배포 주소 아님을 검증한다.
- `SEO_INDEXABLE` 같은 서버 환경변수로 기본값을 `false`로 두고 정식 운영 환경에서만 명시적으로 켠다. 개발·staging·preview는 비색인 상태를 보장한다.
- `NODE_ENV=production`만으로 공개 여부를 판단하지 않는다. preview도 production build일 수 있다. Vercel preview는 명시적 색인 허용보다 우선해 제외하고 다른 호스팅에도 같은 공개 정책을 적용한다.
- 확정된 운영 도메인으로 `metadataBase`, Canonical, `og:url`, sitemap, JSON-LD의 URL을 통일한다.
- 정적 metadata·robots·sitemap에 반영되는 URL·공개 상태·검증 토큰을 바꾸면 재빌드·재배포하고 최종 응답을 다시 확인한다.
- HTTP·HTTPS와 www 유무를 대표 호스트로 영구 리다이렉트하고 경로·필요한 쿼리를 보존한다. 호스팅에 설정이 있으면 중복 구현 없이 실제 응답을 확인한다.

대표 URL과 내부 링크·사이트맵·리다이렉트가 서로 같은 URL을 가리키도록 한다. 자식 페이지에 홈 Canonical을 그대로 상속하지 않는다. [Google Canonical 지침](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [네이버 선호 URL 지침](https://searchadvisor.naver.com/guide/markup-structure)

### Metadata·robots·사이트맵

- 루트 layout에는 사이트 공통 정보와 기본 정책을 둔다. 각 page는 title·description·Canonical·OG/Twitter 제목·설명·URL을 구성한다.
- `src/app/robots.ts`로 정식 사이트의 공개 페이지 수집을 허용하고 운영 sitemap 위치를 기록한다. 렌더링에 필요한 `/_next/`, CSS, JavaScript, 음식 이미지 경로는 차단하지 않는다. [네이버 robots 지침](https://searchadvisor.naver.com/guide/seo-basic-robots)
- 비색인과 수집 차단은 구분한다. 공개 테스트 페이지에 noindex를 읽게 하려면 페이지 수집을 허용해야 한다. `Disallow: /`와 noindex를 함께 쓰는 것만으로 검색 제외를 보장하지 않는다. 비공개 preview에는 호스팅 접근 보호를 사용한다. [Google robots 메타 지침](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- `src/app/sitemap.ts`에는 **색인 허용한 Canonical URL만** 넣는다. 초기에는 준비된 홈만, 매장 페이지는 공개 조건 충족 후 추가한다.
- `lastModified`는 실제 주요 콘텐츠 수정일을 사용한다. 추적 자료가 없으면 생략한다. 생성·배포할 때마다 `new Date()`로 갱신하지 않는다. `priority`·`changeFrequency` 값 조정은 우선 과제가 아니다. Google은 두 값을 사용하지 않는다. [Google 사이트맵 지침](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- App Router의 타입 지원 metadata·robots·sitemap API를 이용한다. 별도 SEO 라이브러리 추가는 필요하지 않다. [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [robots.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [sitemap.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

### 공유 이미지와 아이콘

뚝손 OG는 파일 기반 API로 이미지 크기·alt·Twitter까지 정상 출력된다. 현재 1254×1254 이미지 자체가 SEO 오류는 아니다. 우선 대표 도메인을 바로잡고 공유 화면의 크롭을 확인한다. 이후 필요하면 브랜드 로고와 실제 대표 음식이 보이는 1200×630 공유용 이미지를 별도로 준비한다.

현재 [OG 안내](/Users/james/Documents/project/ddukson-gukbap/README.md:80)는 제공 원본을 그대로 보존하는 정책이다. 원본은 보존하고 별도 공유 자산으로 검토한다. 파일 기반 OG와 metadata 이미지 설정을 혼용할 때 파일 설정이 우선하므로 실제 출력 태그로 검증한다. [Next.js metadata 우선순위](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

### 검색엔진 소유확인과 구조화 데이터

- `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION`을 metadata에 연결하고 `.env.example`에는 이름만 기록한다. Google에서 DNS 소유확인을 사용하는 경우 메타 태그 방식은 필수 조건이 아니다.
- Google Search Console과 네이버 서치어드바이저에 대표 사이트를 등록하고 실제 소유확인 완료·사이트맵 처리 상태를 확인한다. 코드에 토큰이 있다고 등록 완료로 기록하지 않는다. [네이버 진단 안내](https://searchadvisor.naver.com/guide/diagnose-site)
- 최초 JSON-LD는 확인된 운영사 Organization, 뚝손국밥 WebSite, 해당 페이지 WebPage를 작게 구성한다. 운영사와 브랜드를 구분하고 일관된 `@id`로 연결한다. 명칭·로고·회사 정보는 화면의 확정 데이터와 일치시킨다. [Google Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [사이트 이름 지침](https://developers.google.com/search/docs/appearance/site-names)
- JSON-LD는 Server Component의 일반 `<script type="application/ld+json">`로 HTML에 포함한다. 직렬화 시 `<`를 안전하게 이스케이프한다. [Next.js JSON-LD 가이드](https://nextjs.org/docs/app/guides/json-ld)
- Restaurant/LocalBusiness는 실제 지점의 이름·주소 등 필수 정보가 준비된 뒤 검토한다. 본사 사무실 주소를 매장으로 등록하거나 영업시간·가격·리뷰를 추정하지 않는다. [Google LocalBusiness 지침](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- 페이지에 보이지 않는 Q&A·수익 수치·운영 조건을 구조화 데이터에만 넣지 않는다. [Google 구조화 데이터 품질 지침](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- FAQ 리치결과를 목표로 기존 프로젝트의 FAQPage를 복제하지 않는다. Google FAQ 리치결과는 2026-05-07부터 종료됐다. 실제 문의를 줄이는 Q&A가 필요할 때 기존 창업 섹션에 확인된 답변을 먼저 작성한다. [Google 공식 변경 기록](https://developers.google.com/search/updates#removing-faq-rich-result)

## 6. 공개 전 콘텐츠와 성능 준비

### 사실 확인

| 콘텐츠 | 현재 근거 | 공개 전 필요한 결정 |
| --- | --- | --- |
| 메뉴명 | 제공 폴더·파일명을 데이터로 사용 | 현재 판매 메뉴 여부·설명 확정. 가격 임의 생성 금지 |
| 원가율 비교 | 제공 참고 이미지, 산정기간·비교출처 TODO | 기간·계산 기준·비교 근거 확인 또는 수치 공개 보류 |
| 영업이익 등 수익구조 | 제공 이미지 보존, 근거 TODO | 사례의 범위·적용조건·산정근거 확인 또는 수치 공개 보류 |
| 가맹절차·지원범위 | 우동 레퍼런스 요약, 뚝손 최종 확인 TODO | 뚝손의 실제 절차와 지원 내용 확정 |
| 회사 정보·상담 연락처 | 현재 사이트 데이터와 푸터에 기재 | 운영사가 정식 공개 정보인지 확인 |
| 매장 정보 | 현재 0건 | 실제 운영 매장·주소·연락처 등 등록 |

근거: [메뉴](/Users/james/Documents/project/ddukson-gukbap/src/data/menus.ts:70), [원가 비교](/Users/james/Documents/project/ddukson-gukbap/src/data/costComparison.ts:1), [수익구조](/Users/james/Documents/project/ddukson-gukbap/src/data/profitStructure.ts:1), [가맹절차](/Users/james/Documents/project/ddukson-gukbap/src/data/franchiseProcess.ts:1), [회사 정보](/Users/james/Documents/project/ddukson-gukbap/src/data/site.ts:6).

이는 수치를 허위로 판정한 결과가 아니다. 기존 데이터의 공급 근거와 아직 남은 확인 작업을 구분한 공개 준비 목록이다. 확인된 창업 혜택도 전체 창업비용이나 다른 면제 항목으로 확대 해석하지 않는다.

### 렌더링·모바일 성능

- 메뉴의 텍스트 정보는 클릭 없이 최초 HTML에 제공한다. 모든 탭의 큰 이미지를 eager로 로드하는 방식은 피하고, 텍스트와 이미지 로딩 정책을 분리한다.
- 매장 목록용 서버 데이터 읽기와 좌표 보강을 분리해 지도 API 응답 때문에 본문 HTML 생성이 늦어지지 않도록 한다. 빈 CSV를 가짜 매장으로 채우지 않는다.
- 인트로의 직접 앵커 이동 방해를 줄이고 핵심 정보·문의 버튼 접근을 보존한다. 재생·다시보기·일시정지 UI는 추가하지 않는다.
- 모바일·PC 인트로 영상은 각각 약 4.8MB이며 한 방문에는 한 영상만 선택한다. 팝업 PNG 두 장은 합계 약 4.3MB, 로컬 폰트 원본은 Pretendard 약 2MB·MaruBuri Bold 약 1MB다. 파일 크기는 네트워크 요청 경쟁을 조사할 근거이며 실제 전송량·성능 점수는 아니다.
- 첫 화면 음식은 모바일 전용 WebP와 우선 로딩을 이미 사용한다. 영상·팝업·폰트와 동시에 전송되는 자원을 실제 모바일 환경에서 측정하고 영상 압축·팝업 이미지 최적화·폰트 축소를 순서대로 검토한다.
- PageSpeed Insights의 현장 데이터가 없으면 Lighthouse 측정과 구분해서 기록한다. 목표는 LCP 2.5초 이내·INP 200ms 미만·CLS 0.1 미만이며 현재 성적을 의미하지 않는다. [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)

## 7. 참고 프로젝트별 보완 계획

| 프로젝트 | 먼저 보완할 항목 | 재사용할 패턴 |
| --- | --- | --- |
| 오므라이스 | OG 설정 1200×630과 실제 3840×2880 불일치, 로고 JSON-LD 크기 불일치, 화면에 없는 FAQ, 생성일 기반 lastmod | 단일 origin·영구 리다이렉트·메타데이터·검증 태그·JSON-LD 연결 |
| 우동 | OG 설정 1200×630과 실제 1280×853 불일치, `🍳` 자동 아이콘의 브랜드 적합성, 화면에 없는 FAQ, 생성일 기반 lastmod | 단일 origin·영구 리다이렉트·기본 SEO 파일 |
| 곱도리탕 | preview 외 테스트 환경 보호, 생성일 기반 lastmod, 홈 단일 Breadcrumb, 문서의 OG 2종 설명과 코드 1종 불일치 | 공통 origin·별도 metadata·서버 JSON-LD·등록 가이드 |

오므라이스·우동의 FAQ JSON-LD는 현재 사용자에게 같은 Q&A를 제공하지 않는다. 유지하려면 실제 확인된 답변을 화면에 제공하고, 그렇지 않으면 제거를 검토한다. 두 프로젝트의 client page 안 `next/script` 방식은 배포 HTML을 확인하고 서버 JSON-LD 패턴으로 정리한다. [오므라이스 FAQ](/Users/james/Documents/project/omurice-landing/src/app/page.tsx:153), [우동 FAQ](/Users/james/Documents/project/udon-landing/src/app/page.tsx:98)

세 프로젝트 모두 `VERCEL_ENV === 'preview'`에만 의존한 보호와 `new Date()` lastmod를 공통 개선한다. 오므라이스·우동은 도메인 리다이렉트 코드가 있으며, 곱도리탕은 호스팅에서 처리하는지 운영 검증이 필요하다. 코드 부재만으로 운영 리다이렉트 누락을 단정하지 않는다. [오므라이스 next.config](/Users/james/Documents/project/omurice-landing/next.config.ts:17), [우동 next.config](/Users/james/Documents/project/udon-landing/next.config.ts:17), [곱도리탕 등록 가이드](/Users/james/Documents/project/gopdoritang/docs/seo-search-console.md:76)

브랜드별 사업 문구·회사·도메인·설립일·메뉴·수치는 재사용하지 않는다. 오므라이스의 “대한민국 1등”과 곱도리탕 JSON-LD의 설립일도 자료로 확인할 항목이다. 곱도리탕의 `maximumScale: 1`은 접근성 개선 대상으로 검토하며 검색 순위 영향은 단정하지 않는다. [오므라이스 metadata](/Users/james/Documents/project/omurice-landing/src/app/layout.tsx:20), [곱도리탕 구조화 데이터](/Users/james/Documents/project/gopdoritang/src/application/config/structured-data.ts:16), [viewport](/Users/james/Documents/project/gopdoritang/src/application/config/metadata.ts:92)

## 8. 적용 순서와 파일 계획

| 단계 | 작업 | 수정·생성할 뚝손 파일 | 완료 기준 |
| --- | --- | --- | --- |
| 1 · 공개 기반 | URL 검증·환경별 색인 정책·Canonical·검색 소유확인 연결 | `src/lib/seo.ts` 신규, `src/app/layout.tsx`, `src/app/page.tsx`, `.env.example` | 비운영 noindex 유지, 준비된 운영 홈만 index 가능 |
| 1 · 발견 경로 | robots·sitemap·대표 호스트 통일 | `src/app/robots.ts`, `src/app/sitemap.ts` 신규, 필요 시 `next.config.ts` 또는 호스팅 설정 | 대표 URL 일치, 공개 URL만 sitemap, 영구 리다이렉트 확인 |
| 2 · 검색 본문 | 브랜드 소개·메뉴 텍스트·확정 창업 정보 보강 | `GateHeroSection.tsx`, `MenuGallery.tsx`, 해당 `src/data/*`, 기존 메인 섹션 | 클릭·영상 종료에 의존하지 않는 핵심 HTML |
| 2 · 의미 전달 | 최소 JSON-LD·공유 자산 검증 | `src/components/seo/StructuredData.tsx` 신규, `src/app/page.tsx`, 필요 시 OG 별도 자산 | 본문과 JSON-LD 일치, 실제 URL·이미지 태그 확인 |
| 2 · 매장 준비 | 실매장 등록·서버 목록·매장 page metadata | `data/stores.csv`, `src/lib/stores.ts`, `StoreMapSection.tsx`, `src/app/stores/page.tsx` | 데이터 준비 전 noindex, 준비 후 내부 링크·Canonical·sitemap 연결 |
| 2 · 진입 품질 | 앵커 보존·영상/팝업/폰트 요청 최적화 | `VideoIntro.tsx`, `BrandNoticePopup.tsx`, `layout.tsx`, 관련 자산 | 모바일 직접 진입·문의 접근과 성능 측정 |
| 3 · 운영 측정 | 검색 등록·유입과 상담 성공 이벤트·운영 가이드 | 분석 연동 파일(도구 선택 후), `useInquirySubmission.ts`, README | 등록 완료와 상담 성공을 각각 실제 확인 |

파일 경로는 이 저장소 기준의 **향후 구현 계획**이며 생성 완료 목록이 아니다. 공통 설정과 작은 JSON-LD 컴포넌트만 추가하고 기존 섹션·데이터 구조를 유지한다. 새로운 preview route, CMS, 게시판, 리뷰, 매출 시뮬레이터는 이번 계획에 포함하지 않는다.

분석 이벤트 후보는 `inquiry_cta_click`, `phone_click`, `directions_click`, `generate_lead`다. `generate_lead`는 [문의 API의 성공 응답](/Users/james/Documents/project/ddukson-gukbap/src/lib/useInquirySubmission.ts:39) 이후 한 번 기록한다. 버튼 클릭이나 검증 실패를 상담 완료로 집계하지 않는다. 이벤트에 이름·전화번호·문의 원문을 넣지 않는다.

## 9. 검증과 운영 지표

구현 이후 공개 전 검사:

- 준비된 운영 홈은 HTTP 200, 원하는 title·description·자기 URL Canonical, index/follow가 최종 HTML에 존재한다.
- preview·staging은 비색인 정책을 유지하며 호스팅 응답의 `X-Robots-Tag`까지 확인한다. 메타와 헤더가 충돌하면 공개로 간주하지 않는다.
- `/stores`는 데이터 준비 여부에 따라 정책이 분리되고 홈 Canonical을 잘못 상속하지 않는다.
- `robots.txt`·`sitemap.xml`이 정상 응답하고 sitemap에는 noindex·redirect·404·API·fragment URL이 없다.
- HTML·OG·Twitter·JSON-LD·사이트맵의 도메인과 URL이 일치하며 이미지·아이콘 URL이 정상 응답한다.
- 메인 메뉴 텍스트, 확정 매장 정보가 최초 HTML에 있고 지도·탭·영상 실행이 필수 조건이 아니다.
- structured data 문법과 적용 타입을 검증하고 Google URL 검사에서 렌더링·수집 허용 여부를 확인한다.
- `pnpm lint`, `pnpm build` 통과, hydration·브라우저 console 오류 확인, 모바일 속도 측정.
- Google Search Console·네이버 소유확인 완료, sitemap 처리 결과와 주요 URL 검사 결과를 기록한다. 제출 성공과 실제 색인 반영은 구분한다.

공개 이후에는 브랜드/비브랜드 검색어별 노출·클릭·CTR, Canonical 선택·색인 제외 이유, 모바일 성능, 자연검색 유입의 상담 완료를 같은 기간으로 비교한다. 검색량이나 목표 문의 수는 초기 데이터 확보 후 정한다. 사이트맵 제출이나 구조화 데이터만으로 검색 노출·순위가 보장되는 것은 아니다. [Google 사이트맵 지침](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

이번 점검에서 실행한 검증:

- `pnpm lint`: 통과.
- `pnpm build`: TypeScript 검사와 production build 통과. `/`, `/stores`, 두 API, 아이콘·OG 경로 생성 확인.
- 빌드 경고: `metadataBase` 미설정으로 OG/Twitter 기준 URL에 `http://localhost:3000` 사용.
- 생성된 홈·매장 HTML의 robots·Canonical·OG/Twitter·H1·JSON-LD를 직접 파싱해 위 표와 대조.
- 이미지 규격·주요 영상·폰트 파일 크기 확인.
- 로컬 HTTP 서버 실행은 sandbox의 `listen EPERM`으로 시작하지 못했다. HTTP 응답 헤더·실제 브라우저 오류·운영 성능은 이번 점검에서 검증하지 않았다. 빌드 실패와는 별개다.

## 10. 구현에 필요한 미확정 정보

1. 뚝손국밥 정식 대표 도메인과 www 사용 여부.
2. 정식 검색 공개 시점과 운영/preview/staging 배포 구분.
3. 수익·원가 비교의 근거, 뚝손 가맹절차·지원범위의 최종 자료.
4. 실제 매장 자료와 `/stores`의 검색 공개 조건.
5. Google/Naver 등록 권한 또는 담당자, 사용할 소유확인 방식.
6. 문의 전환을 측정할 분석 도구와 운영 담당자.

이 정보가 없어도 비색인 기본값을 유지한 기술 구현과 본문 구조 보강은 준비할 수 있다. 정식 색인 허용과 외부 등록은 운영 URL·공개 자료가 확정된 뒤 적용한다.
