# 한옥 대문 레이어 — 작업 결과

## 결과

첨부 원본을 픽셀 기반 마스크로 분리했다. AI 생성, 인페인팅, 배경 복원,
리사이즈, 색상 변경 없이 원본의 문짝 픽셀을 사용한다.
원본 해상도는 **1492 × 1138**이며 원본 파일은 복사 후 변경하지 않는다.

| 배포 에셋 (`public/images/hero/`) | 크기 | 최종 용량 | 형식 |
| --- | --- | --- | --- |
| `gate-frame.webp` | 1492 × 1138 | 1,089,444 bytes | 무손실 WebP + alpha |
| `gate-door-left.png` | 401 × 716 | 420,073 bytes | RGBA PNG |
| `gate-door-right.png` | 397 × 715 | 422,056 bytes | RGBA PNG |

합계 **1,931,573 bytes / 1.84 MiB**. PNG 작업본은 `working/`, 원본은 `source/`,
진단 이미지와 브라우저 스크린샷은 `debug/`로 분리했다.

원본 SHA-256:
`1e1926befbfe830f4e76235c7d220519d72907c78a42f9af672acf2cb9846c18`

## 좌표와 경계

원본 좌측 상단이 `(0, 0)`이다. `width`, `height`는 끝 좌표를 제외하는 crop 크기다.
모든 좌표의 기준은 `gate-config.json`이며 PNG의 직사각형 외곽에서 실제 문짝
윤곽 밖은 투명하다. doorway 다각형을 픽셀 중심에서 판정한다.

| | x | y | width | height | transform-origin | 열림 회전 |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Left | 350 | 281 | 401 | 716 | `left center` | `rotateY(65deg)` |
| Right | 749 | 282 | 397 | 715 | `right center` | `rotateY(-65deg)` |

- 경첩 기준선: 왼쪽 `x=350`, 오른쪽 `x=1146`.
- 중앙 접합 기준: `x=750`. 어두운 기존 틈 안의 `x=749, 750` 픽셀을 두 문이 공유한다.
  겹친 픽셀은 동일한 원본 색상이며 중앙 철물은 중복되지 않는다.
- 좌우 고정 문설주, 문설주의 경첩 받침 철물, 처마, 보, 조명, 벽, 문턱, 계단은 Frame에 남는다.
- 문짝의 금속 장식판과 각 고리 손잡이는 해당 Door에 포함한다. 중앙 독립 에셋은 없다.
- Frame의 문짝 영역 567,759픽셀은 alpha 0이다. 검은색으로 채우지 않는다.
- 검은 배경 → Left Door → Right Door → Frame 순서로 합성한다.

## 단계별 검증

| Phase | 산출물 / 검사 | 결과 |
| --- | --- | --- |
| 0 | Next 16.3.6, App Router, Tailwind v4, 기존 Hero 확인. 프로젝트에 일치 원본이 없어 첨부 PNG 보존. | PASS |
| 1 | `debug/gate-detection.png` / 문틀 경계, 중앙선, 경첩선 확인 | PASS |
| 2 | 두 문짝 RGBA PNG / tight crop, 투명 외곽, 손잡이 보존 | PASS |
| 3 | `gate-frame.webp`, `debug/gate-frame-checkerboard.png` / 실제 alpha 확인 | PASS |
| 4 | `debug/gate-mask-preview.png` / 빨강 문짝, 초록 고정 구조물 | PASS |
| 5 | `debug/gate-reconstructed.png`, `debug/gate-difference-x16.png` | PASS |
| 6 | `debug/gate-layer-preview.html` | PASS |
| 7 | OPEN/CLOSE, 좌우 경첩 회전, 원근감, 55–70° 조절 | PASS |
| 8 | 경첩, 문틀, 중앙 철물, 문턱, 1280/768/390px 화면 확인 | PASS |
| 9 | 무손실 최적화 후 재조립 재검사 | PASS |

**Closed reconstruction:** RGB 차이 픽셀 **0**, MAE **0**, RMSE **0**, 최대 채널 오차 **0**.
Alpha 차이, 문 영역 덮임 누락, Frame alpha 오류 모두 **0**.
수치는 `debug/gate-validation.json`, 압축 내역은 `debug/gate-optimization.json`에 저장된다.

WebP 인코더는 완전히 투명한 영역의 보이지 않는 RGB 값을 정규화할 수 있다.
검증은 alpha와 보이는 RGB를 비교하며 최종 재조립은 전체 RGBA를 원본과 비교한다.

브라우저에서 55°, 65°, 70°를 확인하고 **65°**를 기본값으로 선택했다.
고정된 바깥쪽 축에서 안쪽으로 회전하며, Frame은 문보다 높은 30번 z-index에 위치한다.
원근 거리 1400px는 원본 폭 기준이며 화면 폭과 함께 비례 조정된다.
자동 재생은 없고 버튼/각도 입력으로만 움직인다.
`prefers-reduced-motion: reduce`에서는 transition 없이 상태가 바뀐다.

브라우저 증빙:

- `debug/gate-browser-closed.png`
- `debug/gate-browser-open-55.png`
- `debug/gate-browser-open-65.png`
- `debug/gate-browser-open-70.png`
- `debug/gate-browser-frame.png`
- `debug/gate-browser-tablet.png` (768 × 1024)
- `debug/gate-browser-mobile-open.png`, `debug/gate-browser-mobile-closed.png` (390 × 844)

최종 독립 개발 경로와 HTML의 OPEN/CLOSE, 각도 입력, 이미지 로딩, 키보드 조작을 확인했다.
최종 브라우저 콘솔 오류/경고는 0건이다. 초기 iframe 기반 검사 도중 출처 없는
MutationObserver 오류 1건이 관측되어, 최종 개발 경로는 동일 HTML을 직접 제공한다.
최종 경로를 새로 열어 재검사할 때 해당 오류는 재현되지 않았다.

## 메인페이지

Hero는 메인페이지 `/#hero`에 렌더링한다. 2026-10-06 사용자 요청에 따라
별도 `/dev/hero-scene`, `/dev/hero-door` 라우트를 삭제했다.
`debug/gate-layer-preview.html`은 에셋 검증 자료로만 보관한다.
요청한 public 경로에 둔 `source/`, `working/`, `debug/`는 제작 자료이므로
정적 파일 URL 자체는 공개 경로다. 최종 Hero에서 사용할 파일은 위 표의 배포 에셋 3개다.

## 재생성

기존 프로젝트의 Next.js 내부 sharp **0.35.5**를 사용한다.
새 npm dependency나 React 라이브러리를 추가하지 않았다.
로컬 Python은 실행 오류가 있고 ImageMagick은 없지만 이 파이프라인에는 필요하지 않다.

검증 완료된 현재 좌표로 전체 재생성:

```sh
node scripts/hero/gate-assets.mjs all
```

새 원본이나 경계를 적용할 경우 `gate-config.json`을 수정하고 다음 순서로 개별 실행한다.
각 단계의 결과를 확인한 뒤 다음 단계로 이동한다.

```sh
node scripts/hero/gate-assets.mjs detection
node scripts/hero/gate-assets.mjs doors
node scripts/hero/gate-assets.mjs frame
node scripts/hero/gate-assets.mjs mask
node scripts/hero/gate-assets.mjs reconstruct
node scripts/hero/gate-assets.mjs preview
# 브라우저에서 닫힘/열림/모바일/경계 검증 후:
node scripts/hero/gate-assets.mjs optimize
```

미리보기는 재조립 PASS, 원본 해시, 설정 해시를 확인한 뒤 생성된다.
최적화는 `working/` 파일을 입력으로 사용하고 재조립 검사를 다시 실행한다.
HTML 수정은 `gate-layer-preview.template.html`에 적용하고 `preview`를 재실행한다.
브라우저 시각 검사와 스크린샷은 수동 QA 기록이며 `all`이 자동으로 갱신하지 않는다.

## 코드 검증

- `pnpm lint`: PASS.
- `pnpm build --webpack`: PASS, TypeScript 포함.
- 기본 `pnpm build` (Turbopack): 환경의 포트 생성 권한 제한으로 실패.
  확장 실행 권한에서도 같은 오류가 발생했다. 앱 코드 오류가 아닌
  CSS 처리 worker의 `binding to a port / Operation not permitted` 오류다.
- 빌드에 기존 `metadataBase` 미설정 경고가 있다. 배포 도메인은 이번 작업에서 임의 지정하지 않았다.

## 다음 작업 후보

현재 작업은 레이어와 경첩 프로토타입에서 완료했다. Production Hero 코드는 변경하지 않았다.

1. 최종 Hero의 검은 내부 배경 구성
2. 국밥 이미지/영상 에셋
3. 김과 보글거림 연출
4. 대문 열림 타임라인
5. 로고 등장
6. Final Hero 컴포넌트 통합
