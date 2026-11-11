# Sidebar follow-up · 2026-11-10

Based on the second sidebar screenshot supplied by the user.

- Scrollbar hidden using scrollbar-width and WebKit scrollbar rules; overflow scrolling retained.
- Navigation entries and child entries: 14px / 20px, weight 400, #555555. Category labels: 14px, #757575.
- Selected route: #202020 regular text plus a 3px × 20px rounded marker. No selected background, inset shadow or continuous child guide line.
- Child indentation and category/branch disclosure remain. Mobile touch targets and visible keyboard focus remain.
- Canonical LibraryNav.css synced to all three projects; shared documentation theme updated to the same appearance.

Checks: production build; two existing navigation tests; two existing theme checks; static verification of 268 files, four entries and 174 resource references; eight compatibility checks and ZIP integrity check. Browser checked primary and child selection, exact active-route count, automatic active-item visibility, wheel scrolling with hidden scrollbar, and 390px mobile spacing without page overflow.

This supersedes the first-stage sidebar styling in DESIGN.md and the earlier deployment archive. The first-stage source hash comparison in VERIFICATION.md predates these authorized canonical navigation CSS updates.

Latest deployment archive: `Design-Systems-Portal-Compat-delivery/MM-Design-Libraries-compat-923dd64610fb.zip`
