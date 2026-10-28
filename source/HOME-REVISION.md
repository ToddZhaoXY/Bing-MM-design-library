# Centered home revision — 2026-10-21

## Follow-up: bounded wordmark / mist and clickable previews

The following supersedes the decorative/inert implementation described below.
The title now caps at 5rem (80px at the default root size); desktop mist caps at
1280 × 480px. Both measured identically in 1920px and 2560px browsing contexts.
At 390px, the title remains two lines, the document scrollWidth stays 390px,
three columns remain visible, and all preview images loaded.

All 18 source previews now use native anchors to 9 registered component routes.
Filler cards and mirrored groups preserve hrefs but are hidden from repeated
screen-reader traversal and use tabindex=-1. No inert containers or blocking
overlay hit areas remain. Keyboard focus makes one column static and scrollable;
leaving it resets its scroll position, preserving seamless animation.

Browser clicks verified MM Image → Image Tile (a mirrored card beneath the
central wordmark), AIGC → Main image area, and Video → Short Card. Keyboard
Tab from navigation reaches a stable Display image card. Motion still runs:
one up column moved -348.411px over 14.511s (~24px/s), and a down column
moved +333.900px (~23px/s). Pause held all transforms identical for 5.956s;
resume restored running state. Twenty-nine automated tests pass, including
link route integrity, clone accessibility, keyboard cleanup and static hosting.
All 362 original library source files remain byte-identical.

The previous centered iteration and both ZIPs are archived in
`../Design-Systems-Portal-delivery/archive/home-centered-v2/`.

## Previous centered iteration

User direction: one large centered MM Design Libraries wordmark, the existing
Explore…Mosaic SDL with you description, three top-right entry links, and a
surrounding moving component waterfall with a soft obscuring mist behind copy.

Confirmed previous motion weakness: browser reported running animations, but
three tracks moved only 24px over 24/28/31s with slow ease-in/out; gallery hover
also paused every column. Visible positions were only -1.41 / +4.91 / -0.29px.

Plan: replace bounded drift with measured seamless loops at ~20-30px/s; remove
hover pause; make background decorative/inert and keep only a compact manual
pause control. Verify measured movement, stationary pause, resume, loop coverage,
small viewports and unchanged library content. Original homepage and deployment
ZIP archived at ../Design-Systems-Portal-delivery/archive/home-v1/.

Implementation: central wordmark and exact description, three top-right links,
six decorative columns (responsive four/three), a central radial mist, and an
icon-only accessible pause control. Repeated groups are measured to exceed the
viewport and cloned once; each cycle translates exactly one group height.

Browser measurement at 837 × 988: over 27.832s, four visible columns moved
-667.800 / +779.106 / -751.276 / +639.974px. Measured speed was respectively
23.994 / 27.993 / 26.993 / 22.994px/s. The native accessibility tree contains
only navigation, heading, description and pause control, not decorative clones.

Pause verification: 62.322 seconds apart, all four measured track positions
changed by exactly 0px. After resume, each track moved again. Responsive checks:
1280 × 720 displays six columns with a single-line wordmark; 837 × 988 displays
four; a 390px browsing context displays three with a two-line wordmark and
document scrollWidth=390. All three native library links remain visible.
