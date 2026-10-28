/**
 * Live image data for the Playground.
 *
 * Hits Bing's image search through the dev-server proxy (`/api/bing`, see
 * vite.config.ts) and normalises the response down to exactly what an Image
 * Tile renders: the photo, its title, its source host, its favicon, and the
 * real pixel dimensions — the last pair is what drives the waterfall's column
 * heights, so the grid is a true masonry instead of a fixed-height template.
 *
 * Field mapping verified against a live response:
 *   thumbnailUrl        → src      (contentUrl is the full-res original)
 *   name                → title
 *   hostPageDisplayUrl  → source   (reduced to the host)
 *   hostPageFavIconUrl  → favicon
 *   width / height      → aspect ratio
 */

export interface SearchImage {
  src: string
  title: string
  source: string
  favicon: string
  width: number
  height: number
}

/**
 * One requery suggestion — what an RS pill renders. Bing returns two families:
 * `relatedSearches` (whole new queries) and `queryExpansions` (the current query
 * plus a facet). Both carry a text label and a thumbnail, so both feed the strip.
 */
export interface SearchSuggestion {
  /** The pill label. `displayText` where present — it's the short form. */
  label: string
  /** Full query behind the pill, used when the pill is clicked. */
  query: string
  thumbnail: string
}

interface BingSuggestion {
  text?: string
  displayText?: string
  thumbnail?: { thumbnailUrl?: string }
}

interface BingItem {
  thumbnailUrl?: string
  contentUrl?: string
  name?: string
  hostPageDisplayUrl?: string
  hostPageUrl?: string
  hostPageFavIconUrl?: string
  width?: number
  height?: number
}

/** `https://fity.club/lists/…` → `fity.club`. Falls back to the raw string. */
function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] ?? url
  }
}

export interface SearchResult {
  images: SearchImage[]
  /** Requery suggestions for the RS strip. Empty when Bing returns none. */
  suggestions: SearchSuggestion[]
}

/**
 * Where to send the request.
 *
 * In dev, `/api/bing` is rewritten by the Vite proxy, which appends the appId
 * server-side (vite.config.ts). A static build has no proxy — on VibeHub that
 * path is just a missing file, and the host answers 404, which surfaced as
 * "Bing search failed: 404". So the static build calls bingapis directly.
 *
 * That is safe here specifically because this endpoint is keyless: the appId is
 * a public identifier, not a secret, and it already ships in Smart Buddy's
 * client bundle. It also turns out to send `access-control-allow-origin`, so
 * the browser call succeeds cross-origin — verified against the live host.
 *
 * If this ever moves to a keyed endpoint, put the proxy back and front it with
 * a same-origin backend instead.
 */
const BING_APPID = 'D41D8CD98F00B204E9800998ECF8427E1510C791'

function endpoint(q: string, count: number): string {
  const qs = new URLSearchParams({
    q,
    count: String(count),
    offset: '0',
    mkt: 'en-US',
    safeSearch: 'Moderate',
  })
  // import.meta.env.DEV is compiled to a literal, so the branch is dropped
  // entirely from the production bundle.
  if (import.meta.env.DEV) return `/api/bing?${qs}`
  qs.set('appId', BING_APPID)
  return `https://www.bingapis.com/api/v7/images/search?${qs}`
}

/** Images only — kept for callers that don't render a requery strip. */
export async function searchImages(query: string, count = 40): Promise<SearchImage[]> {
  return (await search(query, count)).images
}

export async function search(query: string, count = 40, maxSuggestions = 20): Promise<SearchResult> {
  const q = query.trim()
  if (!q) return { images: [], suggestions: [] }

  const res = await fetch(endpoint(q, count))
  if (!res.ok) throw new Error(`Bing search failed: ${res.status}`)

  const data: {
    value?: BingItem[]
    relatedSearches?: BingSuggestion[]
    queryExpansions?: BingSuggestion[]
  } = await res.json()
  const items = Array.isArray(data.value) ? data.value : []

  // relatedSearches first (whole new queries read better as a requery offer),
  // then queryExpansions to fill the row out. De-duped on the label.
  const seen = new Set<string>()
  const suggestions: SearchSuggestion[] = [
    ...(data.relatedSearches ?? []),
    ...(data.queryExpansions ?? []),
  ]
    .map((s): SearchSuggestion | null => {
      const label = s.displayText || s.text || ''
      if (!label || seen.has(label)) return null
      seen.add(label)
      return { label, query: s.text || label, thumbnail: s.thumbnail?.thumbnailUrl || '' }
    })
    .filter((x): x is SearchSuggestion => x !== null)
    // Bing returns ~100 combined; a requery strip is a scroller, not a dump.
    .slice(0, maxSuggestions)

  const images = items
    .map((it): SearchImage | null => {
      const src = it.thumbnailUrl || it.contentUrl || ''
      if (!src) return null
      const page = it.hostPageDisplayUrl || it.hostPageUrl || ''
      return {
        src,
        title: it.name || '',
        source: page ? host(page) : '',
        favicon: it.hostPageFavIconUrl || '',
        // Missing dimensions would collapse a masonry column; 4:3 is the safe default.
        width: it.width && it.width > 0 ? it.width : 4,
        height: it.height && it.height > 0 ? it.height : 3,
      }
    })
    .filter((x): x is SearchImage => x !== null)

  return { images, suggestions }
}
