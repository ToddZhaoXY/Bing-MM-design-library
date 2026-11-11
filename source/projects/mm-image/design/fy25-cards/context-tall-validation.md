# Tall Image card validation

- Implemented 16 source cards: ten 312 × 424 variants and six 424 × 424 variants.
- Retrieved and visually inspected get_design_context screenshots for all 16 top-level source nodes. Text contexts and PNGs are saved as context-tall-<node-id>.*.
- Read nested image geometry and fills: 57 image slots, all source image hash ef79d4f453f2abe81aebe3638960ec536d09dafe. Representative leaf design contexts confirm object-cover. Every descriptor image width and height matches the corresponding source slot.
- Retained the existing exact windows-bloom.png image, downloaded the three Figma SVG icon assets, and checked all referenced local assets are nonempty. SVG root sizes are retained rather than stretched.
- Isolated TypeScript check passed: tsc --noEmit --skipLibCheck --target es2022 --moduleResolution bundler --module esnext src/data/image-cards/tall.ts.
- Browser-verified the static React descriptor preview in context-tall-preview.html: all 16 sections, all 73 rendered images/icons loaded, all 57 photo slot dimensions match Figma. Screenshot saved as context-tall-rendered.png and visually compared with the source targets. This verifies descriptor rendering; the parent task owns final shared-renderer interaction and integrated library verification.
- Source 16:7917 supplies only the first related-search page. Its next-page action is exposed for the host onAction handler; additional results are not fabricated.
- Separate visually matching source cards are retained as variants: 1270:13254 / 1270:13885 and 1270:14440 / 1270:14667. The latter pair differs by 1px in the All images button's right inset.
- Source 1270:13704 has no All images button; this absence is preserved.
- Follow-up crop audit: common 640×360 wallpaper with native center-cover matches source photo regions at MAE 1.083/255 (155×140), 1.041 (155×211), 0.934 (211×211), and 0.596 (424×211). Single 312×424 interior MAE is 0.863 with native cover; applying scaleX(1/.8775) increases it to 22.407. No extra zoom or imageTransform should be applied to this asset. context-tall-crop-comparison.png shows source 1748:1270 on the left and the existing browser preview on the right; browser capture sampling differs, but image feature geometry aligns.
