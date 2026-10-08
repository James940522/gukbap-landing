# 뚝손국밥

산본에프앤비(SANBON F&B)의 뚝손국밥 브랜드 랜딩페이지 프로젝트입니다.

Next.js App Router, TypeScript, Tailwind CSS v4를 사용합니다.
구현 기준은 [AGENTS.md](AGENTS.md)를 참고하세요.

## 개발

```bash
pnpm install
pnpm dev
```

## 검증

```bash
pnpm lint
pnpm build
node scripts/check-menu-assets.mjs
```

메뉴 이미지 URL은 Git에 저장된 한글 파일명과 동일한 NFC 형식을 사용합니다.
`check-menu-assets.mjs`는 macOS에서 가려지는 한글 정규화 차이도 검사하여
Linux 배포에서 메뉴 이미지가 404로 누락되는 문제를 확인합니다.

## UI 초안

- 브랜드 소개, 누룽지 국밥, 전체 메뉴, 곁들임 한 상, 뚝손의 기준, 창업 안내, 문의 폼으로 구성합니다.
- 브랜드 소개 뒤에는 실제 메뉴의 누룽지 국밥 3종을, 전체 메뉴 뒤에는 국밥과 곁들임의 추천 조합을 소개합니다.
  누룽지와 한 상 사진은 `src/data/site.ts`의 `nurungjiFeature.image`, `pairingFeature.image`에 연결할 수 있습니다.
  조합은 메뉴 선택을 돕는 제안이며 고정 세트나 판매 혜택이 아닙니다.
- 메뉴 32종과 카테고리 8개는 `src/data/site.ts`에서 관리합니다.
- 전달받은 샘플 사진은 첫 화면(국밥 한 숟갈), 브랜드 소개(가마솥 조리), 메뉴 소개(순대)에 적용했습니다.
- 사진 원본은 `assets/food/originals/`, 웹용 WebP는 `public/images/food/`에 보관합니다.
  `src/data/site.ts`의 `foodImages`에서 경로를 관리하며 `next/image`로 표시합니다.
- 샘플과 개별 메뉴의 대응은 확인 후 연결합니다. 메뉴 데이터의 `image`에 이미지 경로를 지정하면 표시되며,
  아직 사진이 없는 메뉴는 기존 이미지 영역을 유지합니다.
- 메인 문의 폼과 하단 빠른 문의는 `/api/leads`를 통해 SOLAPI로 담당자에게 문자를 전달합니다. 브라우저에 개인정보를 저장하지 않습니다.
- 회사명, 대표자, 사업자등록번호, 주소, 대표번호, 이메일은 제공받은 정보로 푸터에 표시합니다.
  `src/data/site.ts`의 `brand`에서 관리하며, 창업 문의 영역에도 전화·이메일 링크를 제공합니다.
- 가맹 정책은 확정 후 반영해야 합니다. 온라인 접수 설정은 아래를 참고하세요.
- 상권 안내 다음에 원가율 비교 섹션을 배치했습니다. 문구와 `30% 초반`·`40%`는 제공된 참고 이미지 기준이며,
  표시 수치는 `src/data/costComparison.ts`에서 관리합니다. 구체적인 산정 기간과 비교 출처는 자료 수령 후 보완합니다.
  막대 길이는 참고 이미지의 대략적인 비율로, `30% 초반`을 특정 수치로 확정하지 않습니다.
- 원가율 그래프는 화면에 들어오면 Framer Motion으로 왼쪽부터 한 번 채워집니다. 두 막대의 실제 완료 이벤트를
  모두 받은 뒤 수치가 함께 나타납니다. 움직임 줄이기·인쇄·JavaScript 비활성 상태에서는 완성된 그래프를 표시합니다.
- ‘뚝손의 기준’ 뒤에는 조리 안내를 배치했습니다. `src/data/cooking.ts`에서 문구와 준비·조리·완성 단계를 관리합니다.
  조리 시간, 필요 인원, 완제품 공급 등 확인되지 않은 운영 조건은 참고 이미지에서 가져오지 않았습니다.
  배경은 새로 생성한 AI 주방 연출 이미지이며, 데스크톱 58%·모바일 36% 불투명도로 적용합니다.
  [배경 생성 기록](assets/backgrounds/generated/ddukson-kitchen-ai.json)과
  [사용한 프롬프트](assets/backgrounds/generated/ddukson-kitchen-ai.prompt.txt)를 함께 보관합니다.
- 원가율과 창업 안내 사이에 `#success-roadmap`을 배치했습니다. 사용자가 제공한 `udon-landing`의
  `SuccessionPlanningSectionV2`에서 소개 패널·6개 카드·장식선을 가져왔습니다.
  이미지 6칸은 비워두었으며 `src/data/roadmap.ts`의 `image`에 경로를 넣으면 연결됩니다.
  뚝손 기준으로 확정되지 않은 조리 시간·배송 횟수·매장 평수는 원본에서 가져오지 않았습니다.
  Framer Motion의 영역별 등장·카드 호버를 적용하고, 모바일과 움직임 줄이기에 대응합니다.
- 초안은 검색 색인을 비활성화했습니다. 공개 시 `src/app/layout.tsx`의 robots 설정을 변경하세요.

## 로고

- 전달받은 JPEG 원본은 `assets/logos/originals/`에 보관합니다.
- 배경을 제거하고 여백을 줄인 투명 PNG는 `public/images/logos/`에서 관리합니다.
- `ddukson-gukbap.png`: 헤더, Hero, 푸터의 브랜드 로고.
- `sanbon-fnb.png`: 푸터의 회사 로고.
- 모든 로고는 `next/image`로 표시하며 원본 비율을 유지합니다.
- [로고 처리 기록](assets/logos/README.md)에 원본 대응 관계와 편집 프롬프트를 기록했습니다.

## 공유 이미지 (Open Graph)

- `src/app/opengraph-image.jpeg`는 전달받은 `KakaoTalk_Photo_2026-10-01-10-04-23.jpeg` 원본 그대로입니다.
  크롭, 리사이즈, 재압축 없이 원래 배경과 1254×1254 크기를 유지합니다.
- [Next.js 파일 기반 메타데이터](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)로
  OG 이미지 URL·크기·형식과 `opengraph-image.alt.txt`의 대체 텍스트를 자동 생성합니다.
  Twitter 공유 이미지도 같은 OG 이미지를 사용합니다.
- Vercel에서는 배포 URL을 자동 사용합니다. 다른 호스팅이나 별도 도메인을 사용할 경우
  빌드 환경에 `NEXT_PUBLIC_SITE_URL`을 실제 홈페이지의 전체 주소(`https://` 포함)로 설정하세요.
  로컬 개발에서는 localhost 주소를 사용합니다.

## 섹션 배경

### UI 컬러 역할

첨부 팔레트의 원색과 UI 역할은 `src/app/globals.css`에서 관리합니다.
원색 토큰은 유지하고, 밝은 섹션에서는 글자·포커스·테두리용 토큰만 조정합니다.

| 역할 | 컬러 | 적용 |
| --- | --- | --- |
| 메인 | `#11110F` · `#1C1B18` | 전체 배경, 헤더, 선택된 메뉴 탭, 보조 컨트롤 |
| 서브 | `#F2EDE2` · `#33291F` | 밝은 섹션, 제목, 보조 버튼의 호버, 강조 패널 |
| 포인트 | `#B89348` | 주요 CTA, 체크박스 선택, 아이콘, 강조선 |
| 밝은 포인트 | `#D2B66F` | 주요 CTA 호버, 어두운 영역의 강조 글자와 포커스 |
| 본문 | `#29251F` · `#E5DED0` | 밝은 배경 / 어두운 배경의 본문 |

- 버튼은 기본·호버·눌림·비활성 상태를 구분하고, 모든 키보드 포커스에 배경별 대비를 적용합니다.
- 메뉴 탭, 이동 버튼, 모바일 메뉴, 아코디언, 폼과 하단 링크에도 같은 역할을 적용합니다.
- 입력 오류는 기능을 명확히 구분하기 위해 기존 오류색을 유지합니다.

새로 제공받은 배경 9장을 `public/images/backgrounds/`에 WebP로 최적화했습니다.
7종을 9개 섹션에 분산 적용하며, 2종은 향후 캠페인·조리 과정 섹션용으로 보관합니다.
[배경 배치 가이드](assets/backgrounds/README.md)에 원본 대응, 적용 이유와 보관 이미지의 우선 용도를 정리했습니다.
파일별 용량·해상도는 [변환 기록](assets/backgrounds/manifest.json), 배경 강도·모바일 크롭은
`src/data/sectionBackgrounds.ts`에서 관리합니다. `SectionBackground`는 `next/image`로 화면 크기에 맞게 로드합니다.

기존 `omurice-landing/public/asset/bg/`에서 복사한 네 파일은 보관하며,
현재는 새로 제공받은 이미지와 아래 SVG 질감을 사용합니다.

| 파일 | 적용 영역 |
| --- | --- |
| `main-section1-bg.jpg` | 보관 · 현재 미사용 |
| `sec7-bg.jpg` | 보관 · 현재 미사용 |
| `main-section10-bg.jpg` | 보관 · 현재 미사용 |
| `sec8-bg.jpg` | 보관 · 한옥 창빛 배경으로 대체 |
| `hanji-texture.svg` | 브랜드 소개·문의 배경 · 코드로 만든 한지 결 |

- 한지는 정적인 SVG의 종이 입자와 불규칙한 섬유 선을 CSS 반복 배경으로 적용합니다.
  외부 사진이나 런타임 스크립트 없이 표시되며, `--paper-texture-opacity`로 강도를 조절합니다.
  문의 영역과 모바일은 강도를 낮추고, 텍스트·음식 사진·입력 폼보다 뒤에 배치합니다.

- 첫 화면은 큰 음식 사진과 원형 선 장식, 브랜드 소개는 넓은 사진과 세로 가치 목록으로 구성합니다.
- 메뉴는 데스크톱에서 세로 카테고리와 슬라이드, 태블릿에서 가로 카테고리와 슬라이드,
  모바일에서 가로 카테고리와 세로 목록으로 표시합니다. 자동 재생은 하지 않습니다.
- 뚝손의 기준은 뚝배기 심볼과 네 가지 원칙, 창업 안내는 펼쳐보는 목록으로 구성합니다.
- 주요 사진과 패널은 12~16px, 입력 필드와 카테고리는 8px 모서리를 사용합니다.

## 폰트

- [Pretendard](https://github.com/orioncactus/pretendard): 본문용 로컬 가변 폰트.
- [마루 부리](https://hangeul.naver.com/font): Hero와 섹션 제목, 중앙 브랜드 심볼 문구에 SemiBold(600)를 사용합니다.
  네이버 공식 WOFF2를 로컬에서 `next/font/local`로 불러오며, 한글 전체를 지원해 제목 교체 시 서브셋을 다시 만들 필요가 없습니다.
- 본문·내비게이션·메뉴명·버튼은 Pretendard를 사용하며, 제목의 자간과 행간을 명조체에 맞춰 조정했습니다.
- 이전 고운바탕 파일은 보관하며 현재 화면에서는 불러오지 않습니다.
- 폰트 라이선스는 `public/fonts`에 함께 보관합니다.

디자인 참고: [오늘은 볶음우동](https://todayudon.com/), [심 곱도리탕](https://www.simgopdoritang.com/).
색감, 제목의 크기와 섹션 리듬을 참고하며 뚝손의 사진·심볼·정보 구조에 맞춰 재구성합니다.

## 가맹문의 전송 설정

1. `.env.example`을 `.env.local`로 복사합니다.
2. `SOLAPI_API_KEY`, `SOLAPI_API_SECRET`, `SMS_FROM`, `SMS_TO` 값을 입력합니다.
3. `SMS_FROM`은 SOLAPI에 등록된 발신번호, `SMS_TO`는 담당자 수신번호입니다.
4. 배포 환경에도 같은 네 가지 서버 환경변수를 입력하고 재배포합니다.

키 값은 클라이언트에 노출하지 않습니다. 미설정 시 API는 503과 전화 문의 안내를 반환합니다.
실제 키 입력 전에는 문자 실발송을 검증할 수 없습니다. 키 입력 후 실제 접수와 수신을 확인하세요.

레퍼런스 세 프로젝트의 SOLAPI HMAC-SHA256 인증 및 담당자 문자 알림 흐름을 적용했습니다.
발송 API는 [현재 SOLAPI 문서](https://solapi.com/developers/api/messages)의
`send-many/detail`을 사용합니다. 단일 LMS 접수 성공 여부를 확인하며, 실패·미설정은 성공으로 표시하지 않습니다.
문의 내용은 800자로 제한하고 전체 문자 2,000바이트(UTF-8 기준)를 초과하면 줄여 달라는 안내를 표시합니다. 자동 재시도는 하지 않습니다.
성공은 SOLAPI의 발송 접수를 뜻하며 담당자 단말의 최종 수신까지 보장하지 않습니다.

서버와 브라우저에서 필수값·길이·전화번호·동의를 검증합니다. 허니팟, 요청 크기 제한,
서버 인스턴스별 IP당 1분 3회 제한, 동일 출처 확인, 전송 시간 제한을 적용합니다.
다중 서버에서는 인메모리 제한이 공유되지 않으므로 호스팅 방화벽의 제한을 함께 설정하세요.
IP 헤더는 호스팅 프록시가 덮어쓰는 환경을 전제로 합니다.

개인정보 안내는 `src/lib/inquiry.ts`에서 공통으로 관리합니다. 현재 안내의 보유·파기 정책을
실제 상담 운영 절차와 맞추세요. SOLAPI 발송 기록은 제공자 정책에 따라 보관됩니다.

문의 배경은 사용자 제공 가로·세로 이미지를 각각 WebP로 변환한
`public/images/inquiry/contact-desktop.webp`, `contact-mobile.webp`입니다.
767px 이하에서 세로 이미지를 사용합니다.
