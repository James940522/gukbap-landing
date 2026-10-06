# AGENT.md — 뚝손국밥 Landing Page

## 0. 프로젝트 개요

이 프로젝트는 **산본에프앤비(SANBON F&B)**의 신규 국밥 브랜드 **“뚝손국밥”** 공식 랜딩페이지를 구축하는 프로젝트다.

초기 목표는 브랜드를 처음 접하는 사용자에게 아래 내용을 빠르게 전달하는 것이다.

1. 뚝손국밥의 브랜드 무드와 정체성
2. 대표 메뉴와 음식의 매력
3. 브랜드가 국밥을 만드는 기준
4. 예비 가맹점주를 위한 기본적인 창업/가맹 문의 진입점

현재 단계에서는 완성형 대규모 프랜차이즈 홈페이지보다 **브랜드 초안 + 가맹 전환이 가능한 고품질 랜딩페이지**를 우선한다.

---

## 1. 핵심 원칙

### 반드시 지킬 것

- Next.js App Router 기반으로 구현한다.
- TypeScript를 사용한다.
- Tailwind CSS v4를 사용한다.
- 애니메이션이 필요하면 Framer Motion을 사용한다.
- 모바일/태블릿/데스크톱 반응형을 기본 전제로 한다.
- `next/image`, `next/font`를 적극 활용한다.
- 시각적으로는 고급스럽되 과하게 화려하지 않게 한다.
- 레퍼런스 사이트의 분위기와 UX 원칙은 참고하되 그대로 복제하지 않는다.
- 뚝손국밥만의 한국적인 정체성을 만든다.
- 실제로 제공되지 않은 매출, 비용, 점포 수, 수익률, 재주문율 등의 사업 데이터를 임의로 만들지 않는다.
- 확정되지 않은 데이터는 `TODO`, placeholder 또는 구조만 구현한다.

### 피해야 할 것

- 새까만 `#000000` + 밝은 순금색 조합의 명품 브랜드 스타일
- 과도한 gradient
- 과도한 glassmorphism
- 24px 이상 radius를 남발하는 SaaS 스타일
- 너무 많은 카드 UI
- 불필요한 캐러셀/슬라이더
- 과도한 parallax
- 스크롤을 방해하는 scroll-jacking
- 페이지 전체에 명조체 사용
- 전통 한식집 느낌을 내기 위한 촌스러운 붓글씨 남발
- 가짜 리뷰, 가짜 매출 수치, 가짜 창업 성공 사례 생성

---

## 2. 레퍼런스 방향

주요 레퍼런스:

- https://todayudon.com/

레퍼런스에서 가져올 것은 **디자인 언어와 정보 배치 방식**이다.

### 참고할 요소

- 극도로 어두운 브라운 계열 배경
- Muted Gold 계열의 얇은 border
- Warm Ivory 계열의 텍스트
- 영문 uppercase eyebrow label
- 넓은 section spacing
- Hero의 좌우 2-column 구조
- 음식 사진을 크게 활용하는 구성
- 가맹 문의 CTA가 명확하게 보이는 구조
- 작은 radius와 절제된 카드 디자인
- 브랜드 소개 → 메뉴 → 경쟁력 → 가맹 전환으로 이어지는 흐름

### 그대로 복제하지 않을 요소

- 일본풍/이자카야 분위기
- 나무 질감을 지나치게 강조한 배경
- 볶음우동 사이트와 동일한 카드 조합
- 동일한 카피 구조
- 동일한 섹션 순서/콘텐츠

뚝손국밥은 **다크한 한국 음식 브랜드 + 현대적인 프랜차이즈 랜딩페이지**로 해석한다.

---

## 3. 브랜드 디자인 키워드

전체 디자인은 아래 키워드를 중심으로 판단한다.

- 묵직함
- 뜨거움
- 진한 육수
- 손맛
- 뚝배기
- 든든함
- 정직함
- 현대적인 한식
- 절제된 고급감

한 문장으로 정리하면:

> 오래된 국밥집의 질감과 현대적인 프랜차이즈 웹사이트의 구조를 결합한다.

---

## 4. Color System

기본 컬러는 CSS variable 또는 Tailwind theme token으로 관리한다.

```css
:root {
  --background: #16110d;
  --background-deep: #100c09;
  --surface: #241b15;
  --surface-elevated: #30241b;
  --surface-soft: #3a2d22;

  --gold: #b78b3f;
  --gold-light: #cba45b;
  --gold-dark: #8f682f;

  --ivory: #f3eadb;
  --text-primary: #f0e6d5;
  --text-secondary: #b7aa99;
  --text-muted: #8f8375;

  --border-gold: rgba(183, 139, 63, 0.42);
  --border-subtle: rgba(243, 234, 219, 0.1);
}
```

### 컬러 사용 비율

대략 아래 비율을 유지한다.

- Dark Brown / Black Brown: 65~75%
- Ivory / Beige: 15~20%
- Gold: 5~10%
- 음식 이미지의 자연색: 나머지

Gold는 면적을 크게 칠하기보다 아래 용도로 사용한다.

- border
- eyebrow
- icon
- small badge
- CTA hover
- 가격 또는 중요한 숫자
- section divider

---

## 5. Background / Texture

뚝손국밥은 레퍼런스의 거친 우드 배경을 그대로 사용하지 않는다.

추천 질감:

- 먹색 벽
- 어두운 한지
- 흙벽
- 무광 석재
- 뚝배기 표면과 비슷한 미세한 grain

### 구현 원칙

- texture는 콘텐츠를 방해하지 않아야 한다.
- opacity는 낮게 유지한다.
- 큰 이미지 texture가 없어도 CSS noise/grain 정도로 대체 가능하다.
- mobile에서는 texture를 약화시켜 가독성을 우선한다.

---

## 6. Typography

### 기본 폰트

우선순위:

1. Pretendard
2. system sans-serif fallback

Next.js font 또는 로컬/웹폰트 전략을 repo 상황에 맞게 사용한다.

### 명조체

브랜드 감성 강조가 필요한 일부 큰 문구에만 선택적으로 사용한다.

추천:

- MaruBuri 또는 유사한 한글 명조 계열

사용 예:

- Hero의 감성 카피
- Brand Story의 한 문장

사용 금지:

- 본문 전체
- navigation 전체
- 카드 설명 전체

### Typography Scale 예시

```txt
Hero Display    56~72px desktop / 40~48px mobile
Section Title   40~52px desktop / 30~36px mobile
Card Title      22~28px
Body            16~18px
Caption         13~14px
Eyebrow         11~13px / uppercase / wide letter spacing
```

---

## 7. Layout System

### Container

```txt
max-width: 1200~1280px
horizontal padding:
- desktop: 32px
- tablet: 24px
- mobile: 20px
```

### Section spacing

```txt
desktop: 120~160px
tablet: 88~120px
mobile: 64~88px
```

### Radius

```txt
small: 8px
base: 12px
large: 16px
```

가급적 16px를 넘기지 않는다.

### Border

주요 카드는 아래 스타일을 기준으로 한다.

```css
border: 1px solid rgba(183, 139, 63, 0.35);
```

명도 차이보다 **border + spacing**으로 영역을 구분한다.

---

## 8. 페이지 구조

초기 V1은 아래 섹션으로 구성한다.

```txt
Header
Hero
Brand Story / About
Signature Menu
Why Ddukson
Franchise Overview
Franchise CTA / Inquiry
Footer
```

필요 이상의 섹션을 만들지 않는다.

---

# 9. Header

## 목적

- 브랜드 인지
- 주요 섹션 이동
- 가맹문의 CTA 확보

## Desktop

```txt
뚝손국밥      브랜드   메뉴   뚝손의 기준   창업안내      [창업 문의]
```

### 동작

- 초기에는 transparent 또는 semi-transparent
- scroll 후 dark background + subtle border-bottom
- anchor navigation 사용 가능
- CTA는 Gold 또는 Ivory 기반으로 강조

## Mobile

- logo
- hamburger
- slide/down mobile navigation
- mobile에서도 `창업 문의` 진입이 쉽게 보여야 함

---

# 10. Hero Section

Hero는 페이지에서 가장 중요한 영역이다.

## Desktop Layout

좌 42~45% / 우 55~58% 비율의 2-column.

```txt
LEFT                            RIGHT

[진한 육수] [손맛] [든든한 한 끼]   대표 국밥 이미지

뚝손국밥                       큰 이미지 카드

뜨끈하게,
제대로.

한 그릇에 담은 깊은 맛.

[브랜드 이야기] [창업 문의]
                               thumbnail 3~5개
```

### Hero 이미지

조건:

- 검은색 또는 짙은 뚝배기
- 김이 올라오는 장면
- 어두운 공간
- 음식에만 warm lighting
- 국밥이 실제로 맛있어 보이는 것 최우선
- text가 들어간 AI 이미지처럼 보이면 안 됨

### Thumbnail

초기 placeholder 이미지가 여러 장 있을 경우 작은 thumbnail UI 구현 가능.

하지만 실제 이미지 수가 부족하면 carousel을 억지로 만들지 않는다.

### Hero Copy 초기안

브랜드 카피는 확정 전이므로 쉽게 교체할 수 있게 data/config로 분리 가능.

```txt
뚝손국밥

뜨끈하게,
제대로.

한 그릇에 담은 깊은 맛.
```

다른 임시 후보:

```txt
뜨겁게 끓이고
든든하게 내놓습니다.
```

```txt
한 그릇을
제대로.
```

---

# 11. Brand Story / About

## 구조

- eyebrow: `ABOUT DDUKSON`
- title
- short description
- large food/cooking visual
- 3개의 brand value

예시:

```txt
ABOUT DDUKSON

뚝배기에 담은
우리의 손맛.

정성
시간을 줄여도 맛까지 줄이지 않습니다.

깊은 맛
한 숟갈부터 느껴지는 진하고 묵직한 육수.

든든함
한 끼를 먹더라도 제대로 먹었다는 느낌.
```

### UI

3개 값은 카드 또는 3-column으로 구성할 수 있으나 지나치게 SaaS스럽지 않게 한다.

가능하면 큰 음식/조리 사진 위 또는 주변에 배치한다.

---

# 12. Signature Menu

## 목적

가장 맛있어 보이는 섹션이어야 한다.

### 구조

```txt
SIGNATURE MENU

가장 자신 있는
뚝손의 한 그릇.

[메뉴 1] [메뉴 2] [메뉴 3]
```

메뉴명과 실제 상품 정보가 아직 없다면 하드코딩으로 가짜 상품을 만들지 않는다.

placeholder 예:

```ts
{
  id: 'signature-01',
  name: '대표 국밥',
  description: '메뉴 설명 준비 중',
  image: '/images/menu/menu-placeholder-01.webp'
}
```

### 카드 스타일

- 이미지 비중이 높을 것
- 텍스트는 최소화
- hover 시 image scale 1.02~1.04 정도
- border는 아주 얇게
- shadow는 거의 사용하지 않음

---

# 13. Why Ddukson

브랜드 경쟁력 및 조리 원칙을 전달하는 영역.

초기에는 실제 검증된 내용만 사용한다.

구조 예:

```txt
WHY DDUKSON

뚝손이
국밥을 만드는 방식.

01 육수
02 재료
03 조리
04 운영
```

각 항목은 추후 확정된 브랜드 정책에 따라 수정하기 쉽게 data-driven으로 구현한다.

### 개발 시 주의

“24시간 끓인 육수”, “100% 국내산”, “매일 직접 손질” 같은 표현은 실제 사실이 확정되지 않았다면 절대 임의 추가하지 않는다.

---

# 14. Franchise Overview

초기 랜딩페이지에서는 복잡한 창업 데이터를 보여주지 않는다.

## 목표

- 창업 가능 브랜드임을 전달
- 운영 체계가 있다는 인상 제공
- 문의 버튼으로 연결

구조 예:

```txt
FRANCHISE

국밥 장사,
복잡하지 않게.

운영 시스템
창업 절차
본사 지원
```

실제 세부 내용은 확정된 자료가 있을 때 업데이트한다.

---

# 15. Franchise CTA / Inquiry

페이지 후반부의 가장 강한 전환 영역.

예:

```txt
뚝손국밥과
함께 시작하세요.

브랜드와 창업에 대해 궁금한 점을 남겨주세요.

[가맹 상담 신청]
```

폼이 필요한 경우 필드 최소화:

```txt
이름
연락처
희망 지역
문의 내용(optional)
개인정보 수집 동의
```

백엔드가 준비되지 않았다면 실제 전송 API를 임의 구현하지 말고 UI와 validation 구조까지만 준비한다.

---

# 16. Footer

최소한의 정보 중심.

```txt
뚝손국밥
SANBON F&B

주식회사 산본에프앤비
사업자 정보 TBD
주소 TBD
연락처 TBD

© SANBON F&B
```

확정되지 않은 회사 정보는 임의 생성하지 않는다.

---

## 17. Component Architecture

repo 상황을 먼저 확인하고 지나친 abstraction 없이 구성한다.

권장 예시:

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css

  components/
    layout/
      Header.tsx
      Footer.tsx
      Container.tsx

    sections/
      HeroSection.tsx
      BrandStorySection.tsx
      SignatureMenuSection.tsx
      WhyDduksonSection.tsx
      FranchiseSection.tsx
      InquirySection.tsx

    ui/
      SectionEyebrow.tsx
      Button.tsx
      GoldBorderCard.tsx

  data/
    navigation.ts
    menus.ts
    brandValues.ts
    franchise.ts

  lib/
    cn.ts

public/
  images/
    hero/
    brand/
    menu/
    franchise/
    texture/
```

단, 기존 repo 구조가 있다면 기존 구조를 우선한다.

---

## 18. Animation Guidelines

애니메이션은 “느리고 묵직하게”.

### 기본 entrance

```txt
opacity: 0 → 1
y: 20px → 0
duration: 0.6~0.9s
```

### Image hover

```txt
scale: 1 → 1.03
duration: 0.4~0.6s
```

### 금지

- bounce
- spring 과다
- 요소가 날아오는 효과
- text scramble
- 지나친 scroll-trigger animation
- 사용자 입력 없이 자동으로 계속 움직이는 UI

`prefers-reduced-motion`을 고려한다.

---

## 19. Responsive Rules

### Desktop

- 2-column Hero
- 메뉴 3-column
- 브랜드 가치 3-column 또는 4-column

### Tablet

- Hero 비율 축소
- 필요하면 1-column으로 전환
- 카드 2-column

### Mobile

- Hero는 image와 text를 세로 배치
- 콘텐츠 우선순위:
  1. 브랜드명
  2. 카피
  3. 음식 이미지
  4. CTA
- 메뉴 카드 1-column 또는 horizontal scroll은 실제 UX에 유리할 때만 사용
- 버튼 touch target 최소 44px
- 텍스트 line-height 충분히 확보

---

## 20. Image Guidelines

실제 이미지 자산이 제공되면 placeholder보다 우선 사용한다.

### 우선 필요한 이미지

- Hero 대표 국밥
- 대표 메뉴 3~4개
- 뚝배기 close-up
- 육수 또는 국물 붓는 장면
- 조리하는 손
- 고기 close-up
- 테이블 세팅
- 매장 또는 주방 이미지

### 이미지 처리

- `next/image`
- 적절한 `sizes`
- Hero는 priority 적용 고려
- 가능하면 WebP/AVIF
- 동일 이미지 반복 사용 최소화
- 모바일 crop 확인

---

## 21. Accessibility

- semantic HTML 사용
- heading hierarchy 유지
- CTA는 `button`/`a` 역할 정확히 사용
- 충분한 color contrast 확보
- 이미지 alt 작성
- decorative image는 빈 alt 고려
- keyboard focus visible 유지
- mobile navigation keyboard 접근 가능하게 구현
- `prefers-reduced-motion` 대응

---

## 22. SEO / Metadata

초기 metadata 예시:

```ts
export const metadata = {
  title: '뚝손국밥 | 한 그릇을 제대로',
  description: '뜨겁게 끓이고 든든하게 내놓는 뚝손국밥 공식 홈페이지입니다.',
};
```

단, 카피가 최종 확정되면 업데이트한다.

향후 추가 고려:

- OpenGraph
- favicon
- canonical
- sitemap
- robots
- LocalBusiness/Restaurant schema는 실제 매장 데이터가 확정된 뒤 적용

---

## 23. Performance

Lighthouse 점수를 의식하되 숫자 맞추기가 목적은 아니다.

### 기본 원칙

- 불필요한 client component 금지
- 기본은 Server Component
- interaction이 필요한 컴포넌트만 `'use client'`
- 큰 JS carousel library 추가 금지
- 이미지 최적화
- font weight 과다 로드 금지
- animation library 사용 범위를 제한
- viewport 밖의 이미지 lazy loading

---

## 24. Development Rules for Codex

작업 시작 전 반드시 다음 순서로 진행한다.

### 1. Repo 확인

먼저 확인:

- package.json
- Next.js 버전
- Tailwind 버전
- src/app 구조
- 기존 global styles
- 기존 component conventions
- lint / formatter 설정
- 현재 public assets

기존 프로젝트의 구조와 설정을 존중한다.

### 2. 구현 계획 제시

대규모 수정 전 간단히 아래를 정리한다.

```txt
- 수정/생성할 파일
- 구현할 section
- 공통 component
- 필요한 asset
```

### 3. 작은 단위로 구현

한 번에 전체 코드를 무리하게 만들기보다 아래 순서를 권장한다.

```txt
Step 1. Design tokens / globals
Step 2. Header + shared layout
Step 3. Hero
Step 4. Brand Story
Step 5. Signature Menu
Step 6. Why Ddukson
Step 7. Franchise + Inquiry
Step 8. Footer
Step 9. Responsive polish
Step 10. Animation / accessibility / SEO
```

### 4. 기존 코드 보호

- 관련 없는 파일은 수정하지 않는다.
- 기존 사용자 코드나 주석을 임의 삭제하지 않는다.
- 대규모 refactor는 요구받지 않는 한 하지 않는다.
- dependency 추가 전 기존 package로 해결 가능한지 확인한다.

### 5. 완료 검증

가능한 경우 반드시 실행:

```bash
pnpm lint
pnpm build
```

repo가 npm/yarn을 사용하면 해당 package manager를 따른다.

TypeScript error, hydration warning, console error가 없는지 확인한다.

---

## 25. Copywriting Rules

뚝손국밥의 카피는 짧고 묵직해야 한다.

좋은 예:

```txt
한 그릇을 제대로.
```

```txt
뜨끈하게,
제대로.
```

```txt
뚝배기에 담은
우리의 손맛.
```

```txt
가장 자신 있는
뚝손의 한 그릇.
```

피해야 할 예:

```txt
정성과 사랑을 가득 담아 고객님의 행복을 위해 최고의 맛을 제공하겠습니다.
```

장황하고 흔한 프랜차이즈 문구는 피한다.

### 사업 정보

매출/마진/창업비/수익률/조리시간/원산지/재료 정책 등 사실 확인이 필요한 문구는 임의 작성하지 않는다.

---

## 26. Interaction Rules

CTA 우선순위:

1. 창업 문의
2. 브랜드 보기
3. 메뉴 보기

CTA가 한 화면에 너무 많아 보이지 않게 한다.

Primary CTA는 페이지 전체에서 스타일을 통일한다.

예:

```txt
Primary: Muted Gold background + dark text
Secondary: transparent + ivory/gold border
```

hover:

```txt
Primary → slightly brighter gold
Secondary → subtle gold tinted background
```

---

## 27. 디자인 판단 기준

구현 중 선택지가 생기면 아래 질문으로 판단한다.

1. 국밥이 더 맛있어 보이는가?
2. 브랜드가 더 묵직하고 신뢰감 있어 보이는가?
3. 사용자가 5초 안에 “뚝손국밥이 어떤 브랜드인지” 이해 가능한가?
4. 가맹 문의 버튼을 찾기 쉬운가?
5. 오늘은 볶음우동 사이트를 그대로 복제한 것처럼 보이지 않는가?
6. 모바일에서도 브랜드 인상이 유지되는가?
7. 장식이 정보보다 앞서지 않는가?

하나라도 크게 어긋나면 디자인을 단순화한다.

---

## 28. Initial Definition of Done

V1 완료 조건:

- [ ] Header 구현
- [ ] Hero 구현
- [ ] Brand Story 구현
- [ ] Signature Menu 구현
- [ ] Why Ddukson 구현
- [ ] Franchise Overview 구현
- [ ] Inquiry CTA 구현
- [ ] Footer 구현
- [ ] Desktop / Tablet / Mobile 대응
- [ ] Design token 적용
- [ ] 이미지 최적화
- [ ] 기본 animation 적용
- [ ] 접근성 기본 대응
- [ ] metadata 적용
- [ ] lint 통과
- [ ] production build 통과
- [ ] console error 없음

---

## 29. 현재 단계에서 하지 않을 것

별도 요구가 있기 전까지 아래 기능은 구현하지 않는다.

- CMS
- 관리자 페이지
- 회원가입/로그인
- 매장 검색 시스템
- 실제 상담 CRM 연동
- 지도 API
- 리뷰 시스템
- 결제
- 복잡한 가맹비 계산기
- 실제 매출 시뮬레이터
- 뉴스/게시판

페이지의 목적은 우선 **브랜드 인상 + 대표 메뉴 + 가맹문의 전환**이다.

---

## 30. 최종 목표

사이트를 본 사용자가 아래 인상을 받아야 한다.

> “새로 만든 브랜드지만 싸구려 프랜차이즈처럼 보이지 않는다.”
>
> “국밥이 진하고 맛있어 보인다.”
>
> “브랜드 톤이 명확하다.”
>
> “창업 브랜드로서도 체계가 있어 보인다.”

기능을 늘리기보다 이 네 가지를 먼저 완성한다.

---

## 31. 사용자 작업 지침 (2026-10-06)

- 다시보기, 재생, 일시정지 등 애니메이션 조작용 UI를 추가하지 않는다.
- 모든 작업 결과는 메인페이지의 실제 섹션에 반영한다. 별도 미리보기 route를 만들지 않는다. route에서만 노출되는 섹션은 메인페이지로 옮기고 해당 route는 삭제한다.
