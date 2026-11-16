# AIXA integration · 2026-11-16

Follow the supplied screenshot and the Algo V8 implementation: a left icon rail
with optional labels, a second library-specific navigation column, and the existing
documentation/content area. The four peer entries are MM, AIGC, Video and Algo.

- Colors: canvas #f5f5f5, surface #ffffff, text #242424, secondary #555555,
  selected marker #222222, focus #5254d4.
- Shared rail/header: upstream local Source Sans Pro. Existing specimen typography
  and each library's documentation typography stay as authored.
- Rail: upstream 56px collapsed / 144px expanded, 32px corner radius, original SVGs,
  active left marker, bottom collapse control. Expanded by default to match the screenshot.
- The width preference persists across all four libraries. Native links support browser
  Back, direct deep links and opening in another tab.
- Under 900px the React libraries use a narrow vertical icon rail; their secondary
  navigation stacks above content. Algo keeps its upstream accessible navigation dialog.
- The homepage retains its original full-viewport waterfall, centered wordmark,
  top-right horizontal entry links, and pause/reduced-motion behavior. The left
  rail is reserved for the individual library pages.

The explicit reference takes precedence over inventing a new visual treatment.
Only shared chrome and path adaptation change; imported component source is preserved.
