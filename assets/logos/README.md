# 로고 자산

사용자가 제공한 원본 두 장은 수정하지 않고 보관합니다.

| 로고 | 원본 | 렌더링용 |
| --- | --- | --- |
| 산본에프앤비 | originals/sanbon-fnb.jpeg | ../../public/images/logos/sanbon-fnb.png |
| 뚝손국밥 | originals/ddukson-gukbap.jpeg | ../../public/images/logos/ddukson-gukbap.png |

내장 image_gen 도구로 배경과 그림자를 제거하고 글씨 주변 여백을 줄였습니다. 실제 알파 채널을 포함한 PNG이며 로고 형태와 질감을 유지하도록 요청했습니다. 원본을 바탕으로 한 AI 편집 결과이므로 추후 공식 벡터 원본이 제공되면 교체할 수 있습니다.

## 산본에프앤비 편집 프롬프트

Use case: background-extraction. Edit target: the attached SANBON company logo photograph. Remove only the dark stone background and all cast shadows from behind the two existing calligraphic characters 山本. Keep the exact original shapes, proportions, relative positions, fine brush ends, cream/beige color and cracked texture inside the lettering. Do not redraw, reinterpret, replace, or add lettering. No added SANBON or F&B text. Output the isolated original two-character logo on an actual fully transparent alpha background, including transparent holes between strokes. Tightly crop the transparent canvas to the outer edges of the complete lettering with at most a tiny 4px safety margin; preserve every delicate brush tip. Landscape image matching the original mark's approximately 1.75:1 bounding-box aspect. No border, no shadow, no background, no checkerboard drawn in.

## 뚝손국밥 편집 프롬프트

Use case: background-extraction. Edit target: the attached Korean 뚝손국밥 brand logo photograph. Remove only the dark stone background and all cast shadows behind the existing lettering. Preserve the original four Hangul characters exactly: 뚝손국밥. Keep the EXACT original calligraphy silhouettes, arrangement, spacing, proportions, thin brush streaks, cream/beige color and cracked texture inside the letters. Do not redesign, rewrite or replace any glyph, and add nothing. Transparent alpha must also appear in holes between strokes. Output only the original isolated wordmark with a truly transparent background. Crop tightly to the bounding box of all four characters, with only a 4px safety margin around the farthest brush tips; remove the large empty top and bottom margins. Wide landscape canvas approximately 2.5:1. No cast shadows, no dark fragments, no drawn checkerboard.
