# 검증 기록

- `pnpm lint`: 통과
- `pnpm build --webpack`: production build / TypeScript 통과
- 기본 `pnpm build`: 환경의 로컬 포트 생성 제한으로 Turbopack가 중단되어 Webpack으로 대체 검증. 프로젝트 빌드 설정은 변경하지 않음.
- 기존 `metadataBase` 미설정 경고는 유지됨. 실제 도메인 정보가 없어 임의 설정하지 않음.
- 메인 페이지 `/#strategy`에 Hero 다음 두 번째 섹션으로 삽입
- 별도 개발 route / 설명 / 재생 UI 제거, 최종 빌드 라우트 목록에서 제거 확인
- 브라우저 콘솔 오류 / hydration 오류: 발견 없음
- 1624px / 1440px / 1024px / 768px / 390px / 320px에서 레이아웃 확인
- 모바일 최소 폭에서 배지 글자 최소 12px 확인
- 모든 이미지 로딩 완료, 가로 넘침 없음, 보드 문구 안전 영역 내 배치 확인
- 애니메이션 완료 후 모든 텍스트와 path가 표시됨
- 초기 에셋 검증용 미리보기/레이어 제어 기능은 메인 통합 시 제거
- 한옥/보드의 실제 alpha 범위 0–255 검증
- 모션 줄이기/인쇄/JavaScript 비활성화용 정적 표시 규칙 구현 및 코드 검토
- `section-desktop-preview.png`, `section-mobile-preview.png`에 최종 화면 저장

마스크 및 영역 경계 자료는 `prepare-assets.mjs`로 재생성 가능하다.
