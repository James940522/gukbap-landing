# 뚝손국밥 Fullscreen Brand Intro 구현 보고

## Intro Flow

기존 홈페이지를 처음부터 렌더링하고, 고정된 fullscreen overlay에서 인트로만 재생한다. 종료 후 `IntroPlayer` DOM을 제거하고 페이지 탐색을 복구한다.

| 기준 시점 | 연출 |
| --- | --- |
| 0초 | 닫힌 한옥 대문 표시 |
| 0.30초 | 미세한 카메라 접근 |
| 0.53초 | 경첩 기준 좌우 문 열림과 카메라 확대 |
| 문 열림 중 | 문 뒤에 미리 배치된 국밥 한 상 사진 공개 |
| 1.15~1.95초 | 한 상 사진을 향해 확대 |
| 1.77초 | 대문 장면 제거, 전체화면 한 상 사진 유지 |
| 1.95~2.40초 | 로고 착지, 약 2~4px의 절제된 impact |
| 2.40초 | “한 그릇의 뚝심, 장사의 시작.” 표시 |
| 3.17초 | 첫 문구 퇴장 시작 |
| 3.40초 | “당신의 가게에, 뚝손국밥.” 표시 |
| 4.18초 | 두 번째 문구 퇴장 시작 |
| 4.36~4.66초 | 사진·로고·문구 퇴장, 검은 화면 완성 |
| 4.72~5.60초 | 검은 Curtain이 중앙에서 좌우로 열림 |
| 종료 1초 후 | 기존 브랜드 안내 팝업 표시 |

일반 재생 기준은 5.6초다. 이미지 준비 시간을 포함한 6초 예산에 맞춰 타임라인을 비례 조정한다. 문구의 등장·퇴장 fade는 각각 0.18초 기준이다. 이미지 오류·준비 지연·Escape 입력 시에는 약 0.35초의 짧은 Curtain 전환으로 종료하며, 애니메이션 완료 callback 외에 timeout fallback도 둔다. 문구는 `INTRO_COPIES`에서 교체할 수 있다.

Gate는 0~1.77초, Brand 장면은 Gate 뒤에서 0~4.66초까지 겹쳐 존재한다. 마지막 Curtain 이동은 4.72~5.60초의 0.88초이며, 전체 정상 재생 시간은 5.6초다.

## Created Components

- `src/components/intro/BrandIntro.tsx`: 자산 준비, 방문 정책, scroll lock, 배경 `inert`, 완료·오류 처리, 팝업 연결.
- `src/components/intro/GateScene.tsx`: 기존 대문 레이어 재구성과 3D 문 열림, 카메라 접근·확대.
- `src/components/intro/BrandScene.tsx`: 전체화면 국밥 한 상 사진·확대, 로고 착지, 문구 교체와 암전.
- `src/components/intro/RevealCurtain.tsx`: 검은 좌우 Curtain과 마지막 홈페이지 공개.
- `src/components/intro/intro.constants.ts`: 자산, 문구, 방문 정책, 일반·Reduced Motion 타임라인.
- 각 컴포넌트의 CSS Module: fullscreen 배치와 반응형 구도.

기존 `GateHeroScene`은 음식·로고·CTA를 첫 렌더부터 표시하는 Server Component로 정리했다. 메인페이지 히어로의 최종 배치는 유지한다.

## Used Assets

| 용도 | 자산 |
| --- | --- |
| 고정 대문 프레임 | `public/images/hero/gate-frame.webp` |
| 좌우 문 | `public/images/hero/gate-door-left.png`, `gate-door-right.png` |
| 브랜드 로고 | `public/images/logos/ddukson-gukbap.png` |
| 국밥 한 상 | `public/images/intro/gukbap-feast.webp` |

사용자가 첨부한 한 상 사진은 원본 `assets/food/originals/gukbap-feast.png`를 보존하고, 1672×941 해상도·WebP quality 90·342,034 bytes의 웹용 이미지로 변환했다. 변환 과정에서 resize나 crop을 적용하지 않았으며, 원본 hash·출력 정보는 `scripts/intro/food-manifest.json`에 기록했다. 화면에 맞춘 crop과 확대는 CSS에서 처리한다.

새로운 창작 이미지는 만들지 않았다. 대문은 `scripts/hero/gate-config.json`의 기존 좌표·경첩·중앙 겹침을 그대로 사용한다. 로고와 한 상 사진은 `next/image`와 초기 로딩을 사용한다.

## Header-Footer

Header·Footer 컴포넌트와 스타일은 수정하지 않았다. Header·main·Footer는 인트로 전후 같은 DOM으로 유지되고, Curtain이 열리면 즉시 드러난다. 인트로 종료와 unmount cleanup에서 문서·body overflow, scrollbar gutter, 배경 `inert`, 이벤트 listener를 원래 상태로 복구한다.

## Responsive

- 데스크톱·태블릿: 대문과 한 상 사진을 전체화면 구도로 표시하고, 사진 확대 뒤 로고·문구를 배치한다.
- 모바일: 사진 crop, 로고 크기, 문구 줄바꿈을 세로 화면에 맞춰 조정한다. 대문 열림과 Curtain 연출은 유지한다.
- Reduced Motion: 대문 3D 연출·사진 확대·착지 흔들림을 생략하고, 짧은 로고 fade와 Curtain으로 약 0.65초 동안 전환한다.
- 애니메이션 조작 버튼이나 별도 미리보기 route는 추가하지 않았다.

## Development Test

기본 정책은 `INTRO_MODE = "always"`다. 새로고침할 때 재생되며 `?intro=1`은 강제 재생 경로로 지원한다. 필요하면 상수를 `"session"`으로 변경할 수 있다. Escape는 화면상의 조작 UI 없이 짧은 Curtain 종료를 실행한다.

최신 한 상 사진 연출을 기준으로 Chrome의 1440×900, 768×1024, 390×844 viewport에서 구도·문구 가독성·가로 overflow를 확인했다. 인앱 브라우저에서도 DOM 유지, overlay 제거, 스크롤·`inert` 복구와 팝업 지연을 측정했다. 사진은 이미 최적화한 WebP를 `next/image`의 `unoptimized`로 제공해 추가 압축 없이 사용한다.

레이어 순서는 대문 30, 브랜드 20, Curtain 0이며, Curtain 중앙에는 1px 겹침을 둔다. Reduced Motion은 짧은 분기 검증과 실제 OS·브라우저 preference 검증을 구분해서 기록한다. 기본 `pnpm build`에서 발생했던 Turbopack worker 포트 권한 제한, 기존 Strategy 이미지의 fill/position 경고와 `metadataBase` 경고도 최종 결과에 구분해 남긴다.

### 최종 검증 결과

최신 사진·카피 변경 이후의 검증 결과다. 인앱 브라우저 캡처의 음식 선명도는 Chrome 캡처로 교차 확인했다.

| 검증 항목 | 결과 |
| --- | --- |
| `pnpm lint` | 최종 Reduced Motion 보정 이후 통과 |
| `pnpm build` / `pnpm build --webpack` | 기본 Turbopack은 worker 포트 권한 제한. 최종 보정 이후 webpack production build·TypeScript·정적 페이지 생성 통과 |
| 데스크톱·태블릿·모바일 사진 crop과 전체 흐름 | 통과. 중앙 국밥 유지, 모바일 문구 두 줄, 가로 overflow 없음 |
| 암전·Curtain·DOM 유지·스크롤 복구·팝업 지연 | 통과. 사진·로고 opacity 0 뒤 Curtain 공개. 같은 Header·main·Footer 유지. 페이지 폭 1425px 유지, 인트로 제거 약 1초 뒤 팝업 표시 |
| 반복 새로고침·이미지 실패·Escape 종료 | 통과. 임시 잘못된 이미지 URL로 실패 경로 검증 후 원래 URL 복구. 실패·Escape 모두 overlay와 lock 제거 |
| Reduced Motion 분기 / 실제 preference 설정 | snapshot을 임시 강제해 검증 후 실제 matchMedia로 복구. Gate·사진·카피 없음, 짧은 중앙 로고와 Curtain. 실제 OS preference 변경은 미검증 |
| Console error 및 기존 warning 구분 | 정상 재생 콘솔 오류 없음. 오류 경로의 의도적 이미지 404는 별도 확인. 기존 Strategy fill/position 및 metadataBase 경고 유지 |

## Remaining Tasks

- 실제 OS·브라우저 Reduced Motion 설정의 preference 변경 동작은 별도 환경에서 확인 가능.
- 문구와 재생 정책은 `INTRO_COPIES`, `INTRO_MODE`에서 교체 가능.
