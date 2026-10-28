/**
 * Standalone HTML export.
 *
 * Why this is a DOM serialisation and not a third emitter:
 *
 * Every component in this library styles itself with inline styles — that was a
 * hard constraint from the start (no Tailwind, no CSS modules). Which means the
 * canvas you are looking at is ALREADY a self-contained document; the only thing
 * standing between it and a portable file is the Playground's own editing
 * chrome. So rather than write a second renderer that would immediately start
 * drifting from the real one, we snapshot what actually rendered.
 *
 * That also makes this the highest-fidelity export of the three: `Copy code`
 * gives you JSX that needs the component library to run, `Copy full state` only
 * means something inside this site, but the HTML opens anywhere — mail it to a
 * PM, drop it in a deck, hand it to an engineer who hasn't cloned anything.
 *
 * Deliberately NOT included: any of the site's own stylesheet. If a rule from
 * styles.css were load-bearing for a component, that component would be broken
 * as a library export anyway — so leaving it out is also a test.
 */

/** Playground-only classes and attributes. None of them mean anything outside. */
const CHROME_SELECTORS = ['.pg__block-chrome']
const STRIP_CLASS_PREFIX = 'pg__'

export interface HtmlExportOpts {
  /** Surface name, for the document title. */
  surface: string
  /** Frame width in real Figma pixels, so the body can centre it. */
  width: number
}

/**
 * Serialise a rendered canvas frame into a complete HTML document.
 *
 * `frame` is the live `.pg__frame` element. It is cloned first — this never
 * touches what the user is looking at.
 */
export function exportHtml(frame: HTMLElement, opts: HtmlExportOpts): string {
  const clone = frame.cloneNode(true) as HTMLElement

  // Drop the selection/reorder overlay.
  for (const sel of CHROME_SELECTORS) {
    clone.querySelectorAll(sel).forEach((n) => n.remove())
  }

  // Drop Playground classes. The ::after outlines and hover affordances hang off
  // these; without the classes they simply never apply, and we don't need to ship
  // styles.css to suppress them.
  const all = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))]
  for (const el of all) {
    const kept = Array.from(el.classList).filter((c) => !c.startsWith(STRIP_CLASS_PREFIX))
    if (kept.length) el.className = kept.join(' ')
    else el.removeAttribute('class')
    // React's dev-mode bookkeeping and our own editing hooks.
    el.removeAttribute('data-reactroot')
    if (el.getAttribute('role') === 'button' && !el.getAttribute('aria-label')) {
      el.removeAttribute('role')
      el.removeAttribute('tabindex')
    }
  }

  // The frame carried its width as an inline style already; keep it, drop the
  // box-shadow the Playground used to hint at the canvas edge.
  clone.style.boxShadow = ''

  const title = `MMACF — ${opts.surface}`

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  /* The only global rules. Everything else is inline on the elements, exported
     exactly as the component library rendered it. */
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #f5f5f5;
    font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 24px 0;
  }
  .mmacf-export { flex: 0 0 auto; background: #fff; }
  a { color: inherit; text-decoration: none; }
</style>
</head>
<body>
<div class="mmacf-export" style="width:${opts.width}px">
${clone.outerHTML}
</div>
</body>
</html>
`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}

/** Trigger a download. Blob + object URL — no backend, works on the Web Hub. */
export function downloadHtml(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Revoke on the next tick; revoking synchronously can race the download in
  // some Chromium builds.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
