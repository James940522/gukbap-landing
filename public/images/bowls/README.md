# 공유된 뚝배기 이미지

2026-10-07에 사용자가 공유한 6장. `source/*.png`는 원본 그대로 보관하고,
같은 이름의 `*.webp`는 페이지에서 사용하는 웹용 이미지다.
원본 크기(1254×1254), 구도, 투명 배경을 유지한다.

| 공유 이미지 | 파일 | 공통 데이터 키 | 확인된 메뉴명 | 현재 사용 위치 |
| --- | --- | --- | --- | --- |
| 10_38_44-1.png | sundae-top.webp | sundae | 순대국밥 | 대표 뚝배기·조리 섹션 |
| 10_38_45-2.png | spicy-sundae-top.webp | spicySundae | 얼큰순대국밥 | 대표 뚝배기 섹션 |
| 10_38_47-4.png | spicy-soup-top.webp | spicySoup | 황태육개장 | 대표 뚝배기 섹션 |
| 10_38_48-5.png | tofu-soup-top.webp | tofuSoup | 돈개장 | 대표 뚝배기 섹션 |
| 10_38_49-6.png | pork-rice-soup-top.webp | porkRiceSoup | 얼큰돼지국밥 | 대표 뚝배기 섹션 |
| 흑자 돌솥에 담긴 얼큰 돼지고기 국밥.png | pork-top.webp | pork | 맑은돼지국밥 | 대표 뚝배기·한 그릇 소개 |

위 메뉴명 매핑은 2026-10-07 사용자가 공유 순서대로 확인한 명칭이다.
원본 파일명에 포함된 표현보다 이 매핑을 우선한다.
기존 메뉴 사진과 메뉴명은 `public/asset/menu/`와 `src/data/menus.ts`에서 관리한다.
대표 뚝배기 6개의 순서는 `src/data/featuredMenus.ts`에서 관리한다.
메인페이지의 `/#featured-menu`에서 대표 뚝배기를, `/#menu`에서 기존 전체 메뉴를 볼 수 있다.

다른 섹션에서는 `src/data/bowlImages.ts`의 `bowlImages`를 가져와
`bowlImages.sundae.src`, `bowlImages.sundae.alt`처럼 사용할 수 있다.

WebP 재생성:

```sh
node scripts/cooking/prepare-bowl.mjs
```

원본 파일명 매핑은 `scripts/cooking/bowl-manifest.json`에 있다.
