import type { ComponentDef, PropDef } from './components'
import { DEFAULT_CANVAS_WIDTH, MAX_BLOCKS, MAX_CANVAS_WIDTH, MIN_CANVAS_WIDTH, STATE_VERSION, SURFACES } from './pageState'
import type { SurfaceDefinition } from './pageState'

function propertyLine(prop: PropDef): string {
  const type = prop.kind === 'boolean' ? 'boolean' : prop.kind === 'text' ? 'string' : prop.values.map(value => JSON.stringify(value)).join(' | ')
  return `    ${JSON.stringify(prop.name)}: ${type}; default ${JSON.stringify(prop.default)}${prop.kind === 'select' && prop.numeric ? '; stored as a string' : ''}${prop.under ? `; meaningful when ${JSON.stringify(prop.under)} is enabled` : ''}`
}

/** The prompt is generated from the same registry used by rendering and import. */
export function aiPrompt(registry: readonly ComponentDef[], surfaces: readonly SurfaceDefinition[] = SURFACES): string {
  return `Assemble an AIGC ACF page using the exact component contract below.
Return only a JSON object, without Markdown or explanatory prose.

OUTPUT SHAPE
{
  "version": ${STATE_VERSION},
  "surface": "creator",
  "width": ${DEFAULT_CANVAS_WIDTH},
  "fitToWidth": true,
  "blocks": [
    { "id": 1, "slug": "<registered component slug>", "values": {}, "live": {} }
  ]
}

RULES
- The version must be ${STATE_VERSION}. Use only the fields in the output shape.
- surface must be creator, serp or blank.
- width is a technical canvas control: an integer from ${MIN_CANVAS_WIDTH} to ${MAX_CANVAS_WIDTH}. It is not a claimed Figma measurement.
- fitToWidth is a boolean; it only affects the workbench viewing scale.
- Use at most ${MAX_BLOCKS} blocks. IDs are unique positive safe integers; block order is reading order.
- Only registered slugs and properties are allowed. Select values must match exactly and are strings, including numeric-looking values. Boolean props must be true or false.
- Omitted values use registry defaults. Text may contain user-provided content; use normal JSON escaping.
- live must be {} in AI-generated output. It is reserved for registered properties reported by actual interactions.
- Do not invent component names, variants, image URLs or source measurements.
- Presets are workbench assemblies, not evidence of a final Figma composition.
${registry.length === 0 ? '- The source registry is currently empty. The only valid blocks array is []. Do not infer any components from preset names.\n' : ''}

SURFACES
${surfaces.map(surface => `- ${JSON.stringify(surface.id)} — ${surface.name}: ${surface.note}\n  preset order: ${surface.preset.filter(slug => registry.some(component => component.slug === slug)).join(' → ') || '(empty)'}`).join('\n')}

COMPONENTS
${registry.map(component => `- ${JSON.stringify(component.slug)} — ${component.name} (${component.tier})\n  ${component.overview}\n${component.props.length ? component.props.map(propertyLine).join('\n') : '  No editable properties.'}`).join('\n\n')}

USER REQUEST:
`
}
