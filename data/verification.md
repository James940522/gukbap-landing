# 가맹점 찾기 구현 및 검증 기록

검증일: 2026-10-14 (Asia/Seoul)

## 구현 완료 기능

- 메인페이지 `#stores`와 공개 `/stores` 페이지에 동일한 매장찾기 섹션 적용.
- 헤더·푸터의 공유 메뉴 데이터에 `/stores` 진입점 추가.
- 서버 CSV 읽기, 스키마·중복 ID·필수값·좌표 검증, `OPEN` 매장만 조회.
- 저장 좌표 우선, 원본 주소 → 정제 주소 → 일치가 확인된 키워드 결과 순서의 서버 지오코딩.
- 주소/키 구분값별 캐시, 주소 변경 시 기존 캐시 미사용, 동시 호출 합치기 및 요청 수 제한.
- 지역·매장명·주소 검색, 목록·핀 선택 연동, 지도 범위·확대·중심 이동, 매장 정보 카드.
- 로고를 사용하는 안전한 DOM 기반 `CustomOverlay`, 선택 핀 강조, 길찾기와 주소 검색.
- 모바일 키보드 접근 가능한 목록/지도 탭, 선택 시 지도 전환, 크기·탭 변경 시 `relayout()`.
- 빈 데이터·빈 검색·API 실패·SDK 실패·좌표 없음 상태 구분과 재시도.
- 서버리스 배포에서 `data/stores.csv`를 포함하는 Next.js 파일 추적 설정.

## 생성한 파일

| 파일 | 역할 |
| --- | --- |
| `data/stores.csv` | 실제 매장 데이터. 현재 헤더만 있음. |
| `data/README.md` | CSV 등록·수정·폐점 및 환경변수·배포 안내. |
| `data/verification.md` | 구현·검증·미검증 범위 기록. |
| `src/app/api/stores/route.ts` | Node.js 매장 조회 API. |
| `src/app/stores/page.tsx`, `page.module.css` | 공개 매장찾기 페이지. |
| `src/components/sections/StoreMapSection.tsx`, `.module.css` | 메인/매장 페이지의 공통 UI. |
| `src/lib/stores.ts` | 서버 CSV 검증·좌표 보강·캐시. |
| `src/lib/kakao-maps.ts` | SDK 중복 방지·타임아웃·재시도. |
| `src/lib/store-search.ts` | 클라이언트 검색·응답 검증·링크 생성. |
| `src/types/stores.ts`, `kakao-maps.d.ts` | 공유 데이터 및 SDK 타입. |
| `tests/stores.test.mjs`, `store-client.test.mjs` | 서버/클라이언트 경계와 실패 처리 검증. |

## 수정한 파일

- `src/app/page.tsx`: 메인페이지에 매장찾기 섹션 추가.
- `src/data/site.ts`: 기존 내비게이션 데이터에 매장찾기 추가.
- `.env.example`: 두 카카오 환경변수 이름 추가. 키 값 없음.
- `next.config.ts`: 매장 CSV 서버 배포 추적에 포함.
- `package.json`, `pnpm-lock.yaml`: 안정적인 CSV 파서 `csv-parse` 추가.
- `README.md`: 매장 기능과 관리 안내 링크 추가.

다른 작업에서 변경 중인 기존 섹션·스타일은 이 기능의 수정 범위에 포함하지 않습니다.

## 재사용한 기존 코드와 보강

`/Users/james/Documents/project/omurice-landing`의 다음 파일을 읽고 기존 흐름을 적용했습니다.

- `src/widgets/store-map/ui/StoreMapSection.tsx`: SDK 로딩, 지도 생성, 커스텀 핀,
  검색에 따른 핀 갱신, 목록 선택, 모바일 목록/지도 전환.
- `src/app/api/stores/route.ts`: 서버 CSV 조회, 주소 정제·좌표 보강,
  동시 요청 제한과 24시간 좌표 캐싱 흐름.
- `src/lib/stores.ts`: API 기반 데이터 조회와 지역·매장명·주소 검색 흐름.
- `src/types/kakao-maps.d.ts`: 필요한 SDK 전역 타입 선언 구조.

기존의 직접 만든 줄 단위 CSV 파서는 `csv-parse`로 교체했습니다.
API 실패를 빈 배열로 처리하던 방식, REST 키가 없으면 전체 조회가 실패하던 방식,
첫 키워드 결과를 무조건 채택하던 방식은 보강했습니다.
핀 클릭과 목록 선택을 같은 상태로 연결하고 SDK 실패/재시도와 언마운트 정리를 추가했습니다.
원본 프로젝트의 파일, 매장 데이터, 앱 키는 수정하거나 가져오지 않았습니다.

## CSV·환경변수 관리

[매장 관리 안내](README.md)에 전체 절차를 기록했습니다.
실제 매장은 `data/stores.csv`에 행을 추가합니다. 개발에서는 저장 후 새로고침,
운영에서는 변경된 파일을 포함한 재배포로 반영합니다.

뚝손국밥 앱(ID `1607607`)의 `NEXT_PUBLIC_KAKAO_MAP_KEY`와
`KAKAO_REST_API_KEY`를 `.env.local` 및 배포 환경에 각각 설정합니다.
JavaScript 키만 브라우저에 사용하며 REST 키는 서버에만 사용합니다.
`.env.local`은 생성하거나 커밋하지 않았습니다.

## 실행 및 검증 결과

- `node --test tests/stores.test.mjs tests/store-client.test.mjs tests/leads.test.mjs`: 19개 통과.
  새 기능 18개와 기존 문의 API 회귀 검사 1개입니다.
- `pnpm exec tsc --noEmit`: 통과.
- `pnpm lint`: 통과.
- `pnpm build`: 프로덕션 빌드 통과. `/`, `/stores`, `/api/stores` 경로 생성 확인.
- API 빌드 추적 파일에 `data/stores.csv` 포함 확인.
- 브라우저 정적 청크에 REST 키 환경변수나 검증용 키가 포함되지 않은 최종 빌드 확인.
- 실제 로컬 HTTP API에서 빈 CSV, 신규 행 추가, 이름·주소 수정, `CLOSED` 제외,
  중복 ID 422, 잘못된 좌표 행 제외, REST 키 없는 좌표 미지정 매장 유지를 검증했습니다.
  이 검증에 사용한 CSV 행은 즉시 제거하고 원래 헤더만 있는 파일로 복원했습니다.
- 실제 브라우저에서 키 미설정 화면, 메인페이지 섹션·메뉴 연결,
  모바일 탭 및 320/375/768/900/1280/1440px 가로폭의 넘침 없음을 확인했습니다.
  해당 정상 흐름에서 페이지·콘솔 오류는 없었습니다.
- **모의 API/SDK 브라우저 검증:** 검색, 핀 갱신, 목록·핀 선택,
  선택된 매장을 포함한 다중 검색 결과 범위 조정, 단일 결과 이동,
  길찾기 링크, 안전한 문자열 렌더링, 모바일 키보드 전환·`relayout()`,
  API/SDK 실패 후 재시도를 확인했습니다. 이 검증은 실제 카카오 호출을 차단했습니다.

기존 `metadataBase` 미설정에 따른 localhost 공유 이미지 기준 경고는 빌드에서 유지됩니다.
운영 도메인 설정은 기존 README의 `NEXT_PUBLIC_SITE_URL` 안내를 따릅니다.

## 추가 확인이 필요한 사항

- 실제 뚝손국밥 매장 자료를 CSV에 등록해야 합니다.
- 신규 앱의 JavaScript/REST 키, 지도 활성화·Local API 권한·쿼터와 SDK 도메인을 확인해야 합니다.
- **실제 카카오 지도 타일·핀, 실제 주소 변환, 실환경 길찾기 도착지는 미검증입니다.**
  모의 SDK 통과를 실제 지도 검증으로 간주하지 않습니다.
- 서버 메모리 캐시는 재시작·서버리스 인스턴스 교체 시 사라집니다.
  변환 비용을 줄이려면 검증한 좌표를 CSV에 저장합니다.
