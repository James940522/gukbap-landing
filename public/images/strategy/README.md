# 3WAY 전략 — 메인 페이지 두 번째 섹션

- 실제 위치: 메인 페이지 `/#strategy`, Hero 바로 다음
- 원본 보존: `source/strategy-section-original.png`
- 섹션: `src/components/sections/StrategySection.tsx` / `StrategySection.module.css`
- 문구, 그래프 좌표, 노드 좌표, 타이밍: `src/data/strategy.ts`
- SVG 원본: `src/data/strategy-icons.json`

메인 페이지에서 `HeroSection → StrategySection → LandscapeSection` 순서로 표시한다.
별도 미리보기 route와 설명/재생 UI는 제거했다. 이미지에는 기본 lazy loading을 사용한다.

## 이미지로 보존한 것

| 파일 | 용도 | 투명도 |
| --- | --- | --- |
| `bg-paper-texture.webp` | 장식 없는 한지 바탕 | 불투명 |
| `bg-hanok-left.webp` | 한옥/대나무 수묵 장식 | 실제 alpha |
| `board-frame.webp` | 빈 종이 면을 포함한 나무 보드 | 외곽 alpha |
| `bg-food-right.webp` | 여러 국밥을 포함하는 음식 콜라주 | 불투명, CSS clip-path로 영역 제어 |
| `bg-food-mobile.webp` | 모바일 그래프용 세로 음식 구도 | 불투명, 899px 이하에서 사용 |

실제 해상도·바이트 수와 총 WebP 용량은 `source/asset-manifest.json`을 참고한다.
구름 장식은 선택 사항으로 제외했다. 한옥과 종이의 질감만으로 바탕 분위기를 유지한다.

원본에서 보드 글자나 그래프에 가려진 영역을 그대로 잘라서는 독립 자산을 만들 수 없으므로,
내장 `image_gen`으로 원본을 참고해 각각 복원 생성했다. 픽셀 단위 동일 추출이나 실제 메뉴 촬영본은 아니다.
최종 프롬프트는 `source/generation-prompts.json`, 생성 원본 PNG는 `working/`에 보존했다.
WebP 변환에는 기존 Next.js 의존성의 sharp를 사용했으며 새 패키지를 추가하지 않았다.

## 코드로 렌더링한 것

- `3WAY 전략`, 설명, 체크리스트, `OK`, 상승 문구: 실제 HTML 텍스트
- 상승선/화살촉, 연결선, 원형 포인트: SVG
- 배지 배경: CSS 원형 + 얇은 이중 경계
- 배지 아이콘: inline SVG, 배지 라벨: HTML
- 체크: SVG path draw

배지와 그래프는 같은 좌표계에서 위치를 계산한다. 각 포인트의 실제 경로상 진행률을
desktop/mobile 각각 저장하여 선이 해당 위치에 도달할 때 포인트가 등장한다.
음식과 화살표는 독립 레이어이므로 이미지 교체, 색 변경, 타이밍 변경이 서로 영향을 주지 않는다.

아이콘 파일도 별도로 제공한다: `icons/check.svg`, `icons/icon-store.svg`,
`icons/icon-liquor.svg`, `icons/icon-bowl.svg`.

## 애니메이션 / 반응형

Framer Motion으로 viewport에 진입할 때 한 번 재생한다.
보드 fade-up → 그래프 draw → 경로상 노드/배지 → 제목/설명 → 체크리스트 → OK 강조.
음식은 고정하며 parallax는 사용하지 않았다.

899px 이하에서는 보드와 그래프를 세로로 다시 구성하고, 그래프·배지 좌표와 모바일 전용 음식 이미지를 사용한다.
섹션은 공통 `--section-height`를 최소 높이로 사용한다. 데스크톱은 원본 비율에 필요한 높이와
화면 높이 중 큰 값을 사용하고, 모바일은 콘텐츠 높이를 유지하며 남는 높이를 그래프에 배분한다.
SVG 선과 음식 마스크는 같은 비율 좌표로 늘어나고, 원형 포인트/배지는 HTML/CSS로 원형을 유지한다.
상승 문구 각도도 실제 그래프의 마지막 구간 기울기에 맞춘다.
모바일 그래프는 자체 viewport 진입을 기준으로 애니메이션을 시작한다.
`prefers-reduced-motion`, 인쇄, JavaScript 비활성화 시 모든 핵심 내용을 정적으로 표시한다.

제공된 카피를 유지했으며 임의의 매출 수치/축을 추가하지 않았다.
이 그래프는 전략의 방향을 설명하는 개념 도식이며 실제 매출 데이터를 표시하는 차트가 아니다.

## 재생성 / 디버그 자료

프로젝트 루트에서 실행:

```sh
node scripts/strategy/prepare-assets.mjs
```

이 명령은 `working/` PNG를 WebP로 인코딩하고, 동일한 JSON에서 SVG 아이콘을 생성하며,
아래 검토 자료를 만든다. 이미지 생성 API를 다시 호출하지 않는다.

- `debug/asset-boundary-preview.png`: 원본의 6개 영역을 색상으로 구분
- `debug/board-mask-preview.png`: 프레임 alpha + HTML 텍스트 안전 영역
- `debug/food-mask-preview.png`: 음식 마스크와 별도의 그래프

다음 디자인 작업 후보는 브랜드 타이포 미세 보정과 실제 메뉴 사진으로 교체하는 작업이다.
