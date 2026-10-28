/**
 * AI prompt export.
 *
 * The Playground already round-trips a full canvas through `Copy full state` /
 * `Load state`. That means the assembly problem is already solved for machines:
 * anything that can emit a valid page-state JSON can build a page here.
 *
 * So instead of embedding a chat client — which would need a backend to hold an
 * OAuth secret, and would put an MS-internal design tool in front of a personal
 * Copilot account — we export the contract. The user pastes this into whatever
 * assistant they already have open, describes the page, gets JSON back, and
 * pastes it into Load state.
 *
 * Everything below is DERIVED from the component registry and the surface table.
 * Nothing is hand-transcribed, so the prompt cannot drift from the real schema
 * the way a written-once doc would.
 */

import { components } from './components'
import type { ComponentDef, PropDef } from './components'

/** The subset of a Surface this module needs. Keeps it decoupled from Playground. */
export interface SurfaceBrief {
  id: string
  name: string
  note: string
  preset: [string, Record<string, unknown>][]
}

/** One prop, as a line an LLM can follow without guessing. */
function propLine(p: PropDef): string {
  const under = p.under ? `  (only meaningful when ${p.under} is true)` : ''
  if (p.kind === 'select') {
    const vals = p.values.map((v) => JSON.stringify(v)).join(' | ')
    const num = p.numeric ? '  — numeric, but stored as a string' : ''
    return `    ${p.name}: ${vals}   default ${JSON.stringify(p.default)}${num}${under}`
  }
  if (p.kind === 'boolean') {
    return `    ${p.name}: true | false   default ${p.default}${under}`
  }
  return `    ${p.name}: string   default ${JSON.stringify(p.default)}${under}`
}

function componentBlock(c: ComponentDef): string {
  const head = `- slug: "${c.slug}"   (${c.name} · ${c.tier}${c.partOf ? ` · part of ${c.partOf}` : ''})`
  const overview = `    ${c.overview}`
  const props = c.props.length
    ? c.props.map(propLine).join('\n')
    : '    (no props)'
  return [head, overview, props].join('\n')
}

/**
 * Build the prompt. `surfaces` comes from the Playground's own SURFACES table so
 * the preset stacks quoted here are the real ones.
 */
export function aiPrompt(surfaces: SurfaceBrief[]): string {
  const tileProps = components.find((c) => c.slug === 'image-tile')?.props ?? []

  const surfaceLines = surfaces
    .map((s) => {
      const stack = s.preset.length
        ? s.preset.map(([slug]) => `"${slug}"`).join(' → ')
        : '(empty)'
      return `- "${s.id}" — ${s.name}\n    ${s.note}\n    typical stack: ${stack}`
    })
    .join('\n')

  return `You are assembling a page for the MMACF component library (Multimedia ACF —
Bing Image Search design system). Your output is a single JSON object that the
library's Playground can load directly via its "Load state" button.

Reply with ONLY the JSON. No prose, no markdown fence, no explanation.

=============================================================
OUTPUT SHAPE
=============================================================

{
  "version": 1,
  "surface": "<surface id>",
  "query": "",
  "blocks": [
    { "id": 1, "slug": "<component slug>", "values": { ... }, "live": {} }
  ],
  "items": [],
  "suggestions": []
}

Rules:
- "id" is any unique integer per block. The Playground reissues them on load,
  so they only need to be distinct within your output.
- "values" holds that component's props. Omit a prop to accept its default.
  Every value is a JSON string, boolean, or number matching the prop's kind.
- "live" is always {} — it is runtime state the component fills in itself.
- "items" and "suggestions" are live Bing search payloads. Leave both as []
  unless you were given real ones; the canvas then shows the Figma default
  artwork, which is the correct placeholder.
- Block ORDER is page order, top to bottom.
- Never invent a slug. Only the slugs listed below exist; an unknown one makes
  the whole snapshot fail to parse.

=============================================================
SURFACES  (the "surface" field)
=============================================================

${surfaceLines}

A surface sets the page frame, the content column width, and the Bing shell
chrome. Pick the one that matches what the user is describing; when they say
"SERP" or "image answer" use serp, when they say "IRP" or "the whole image
results page" use irp, and when they want components on a bare canvas use blank.

=============================================================
COMPONENTS  (the "slug" and "values" fields)
=============================================================

${components.map(componentBlock).join('\n\n')}

=============================================================
CONTENT BLOCKS — extra fields
=============================================================

A "content" block may carry two optional keys beyond "values":

  "tileAll": { ... }              props applied to EVERY tile in that block
  "tileOne": { "0": { ... } }     props for one tile, keyed by tile index

Both take the Image Tile prop set:
${tileProps.map(propLine).join('\n')}

A tile-level prop beats "tileAll", which beats the layout's own baseline.
Only add these when the user asks for a specific tile to differ — otherwise
leave them out entirely.

Multiple "content" blocks on one page are a real pattern (a long IRP is several
rows of grid). They render as one continuous waterfall: the second block picks
up where the first left off. You do not need to do anything for this.

=============================================================
EXAMPLES
=============================================================

User: "a SERP image answer with the header and a waterfall grid"

{
  "version": 1,
  "surface": "serp",
  "query": "",
  "blocks": [
    { "id": 1, "slug": "header", "values": { "title": "Image of Living Room", "showSubTitle": false }, "live": {} },
    { "id": 2, "slug": "content", "values": { "layout": "Waterfall" }, "live": {} },
    { "id": 3, "slug": "footer", "values": { "clickAction": "Expansion: See more" }, "live": {} }
  ],
  "items": [],
  "suggestions": []
}

User: "a long IRP — related searches on top, then two rows of dense grid"

{
  "version": 1,
  "surface": "irp",
  "query": "",
  "blocks": [
    { "id": 1, "slug": "rs-on-top", "values": {}, "live": {} },
    { "id": 2, "slug": "content", "values": { "layout": "Dense" }, "live": {} },
    { "id": 3, "slug": "content", "values": { "layout": "Dense" }, "live": {} }
  ],
  "items": [],
  "suggestions": []
}

=============================================================
NOW BUILD
=============================================================

The user's request follows. Read it, choose the surface, stack the blocks in
reading order, and emit the JSON object and nothing else.

REQUEST:
`
}
