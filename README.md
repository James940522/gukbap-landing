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
```

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
- 문의 폼은 입력 검증만 수행합니다. 네트워크 전송이나 브라우저 저장을 하지 않습니다.
- 실제 접수 채널, 개인정보 안내, 회사 정보, 가맹 정책은 확정 후 반영해야 합니다.
- 초안은 검색 색인을 비활성화했습니다. 공개 시 `src/app/layout.tsx`의 robots 설정을 변경하세요.

## 로고

- 전달받은 JPEG 원본은 `assets/logos/originals/`에 보관합니다.
- 배경을 제거하고 여백을 줄인 투명 PNG는 `public/images/logos/`에서 관리합니다.
- `ddukson-gukbap.png`: 헤더, Hero, 푸터의 브랜드 로고.
- `sanbon-fnb.png`: 푸터의 회사 로고.
- 모든 로고는 `next/image`로 표시하며 원본 비율을 유지합니다.
- [로고 처리 기록](assets/logos/README.md)에 원본 대응 관계와 편집 프롬프트를 기록했습니다.

## 섹션 배경

`omurice-landing/public/asset/bg/`에서 요청받은 네 파일을 원본 그대로
`public/asset/bg/`에 복사했습니다. 사진 배경은 창업 안내의 작은 패널에만 사용하고,
섹션 전체는 먹색과 아이보리를 번갈아 배치합니다. 모바일에서는 배경 질감을 더 약하게 표시합니다.

| 파일 | 적용 영역 |
| --- | --- |
| `main-section1-bg.jpg` | 보관 · 현재 미사용 |
| `sec7-bg.jpg` | 보관 · 현재 미사용 |
| `main-section10-bg.jpg` | 보관 · 현재 미사용 |
| `sec8-bg.jpg` | 창업 안내 패널 · 짙은 브라운 질감 |
| `hanji-texture.svg` | 브랜드·전체 메뉴·뚝손의 기준·문의 배경 · 코드로 만든 한지 결 |

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
