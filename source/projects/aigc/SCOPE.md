# AIGC ACF conversion scope

Source: https://www.figma.com/design/8voz5X3e3lPITEt9q5bbUe/AIGC-ACF

The user's screenshot defines the page allowlist. Only these pages supply design content:

| Tier | Figma page | Planned component route |
|---|---|---|
| Molecule | Main image area | main-image-area |
| Molecule | Image display list | image-display-list |
| Molecule | History panel images | history-panel-images |
| Cell | Main content area | main-content-area |
| Cell | History panel | history-panel |
| Cell | Sign-in prompts | sign-in-prompts |
| Cell | Error states | error-states |
| Cell | Action bar | action-bar |
| Cell | Creation composer | creation-composer |
| Cell | Style menu | style-menu |
| Cell | SERP Carousel | serp-carousel |
| Organism | SERP · AIGC Answer | serp-aigc-answer |
| Source | Components | Source components for the above entries |

Divider pages are organizational labels. Cover, Archive, All pages, Dropdown menu,
Portal composer, and every other unlisted page are excluded.

## Architecture baseline

MM_ACF main at 8fcc785dd5b458f29e16b88db1e2d167caae192e:
React + TypeScript + Vite, HashRouter, level-first navigation, component registry,
live property workbench, semantic JSX, full-page assembly, flattened Mosaic SDL v2,
bundled catalog validation, explicit unsupported-feature reports.

Source Figma values take precedence over generic design recommendations. Fidelity
claims require extracted node evidence and visual comparison. Do not invent
variants, source node IDs, ownership bins, or Mosaic platform capabilities.
