import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'

async function moduleFrom(relative) {
  const result = await build({ entryPoints: [fileURLToPath(new URL(relative, import.meta.url))], bundle: true, write: false, format: 'esm', platform: 'node', target: 'es2020' })
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'))
}
const { parsePageState, validatePageState, validateLiveValues, stateJSON, nextBlockId, effectiveValues, MAX_BLOCKS } = await moduleFrom('../src/data/pageState.ts')
const { aiPrompt } = await moduleFrom('../src/data/aiPrompt.ts')
const { resolveAssetUrl, escapeHtml } = await moduleFrom('../src/data/exportHtml.ts')

// Contract fixtures are test-only; they are not shipped as fabricated AIGC entries.
const registry = [{ slug: 'test-component', name: 'Test component', tier: 'Cell', nodeId: 'test:1', bin: 'TBD', verified: true, overview: 'Test fixture.', props: [
  { name: 'state', kind: 'select', values: ['Rest', 'Busy'], default: 'Rest' },
  { name: 'count', kind: 'select', values: ['1', '4'], default: '4', numeric: true },
  { name: 'enabled', kind: 'boolean', default: true },
  { name: 'prompt', kind: 'text', default: '' },
] }]
const makeState = () => ({ version: 1, surface: 'creator', width: 1200, fitToWidth: true,
  blocks: [{ id: 1, slug: 'test-component', values: {}, live: {} }] })
function parse(state) { return parsePageState(JSON.stringify(state), registry) }
function rejected(state, pattern) {
  const result = parse(state)
  assert.equal(result.ok, false)
  assert.match(result.error, pattern)
}

test('state round-trip preserves content and applies only registry defaults', () => {
  const state = makeState()
  state.blocks[0].values = { prompt: 'A "quote" \\ newline\n{brace} <tag> &', enabled: false }
  const result = parse(state)
  assert.equal(result.ok, true)
  assert.deepEqual(result.state.blocks[0].values, { state: 'Rest', count: '4', enabled: false, prompt: state.blocks[0].values.prompt })
  assert.deepEqual(parsePageState(stateJSON(result.state), registry), result)
})
test('empty registry accepts empty canvas and rejects invented components', () => {
  const state = { ...makeState(), blocks: [] }
  assert.equal(parsePageState(JSON.stringify(state), []).ok, true)
  assert.equal(parsePageState(JSON.stringify(makeState()), []).ok, false)
})
test('schema version and required shape are enforced', () => {
  rejected({ ...makeState(), version: 2 }, /version/)
  rejected({ ...makeState(), fitToWidth: 'true' }, /fitToWidth/)
  rejected({ ...makeState(), query: 'unsupported' }, /query/)
  for (const text of ['null', '[]', '"string"', '{oops}', '```json\n{}\n```']) assert.equal(parsePageState(text, registry).ok, false)
})
test('surfaces and canvas width are validated without coercion', () => {
  for (const surface of ['creator', 'serp', 'blank']) assert.equal(parse({ ...makeState(), surface }).ok, true)
  rejected({ ...makeState(), surface: 'irp' }, /surface/)
  for (const width of [0, 319, 3841, 1200.5, '1200', null]) rejected({ ...makeState(), width }, /width/)
})
test('unique positive safe block IDs and registered slugs are required', () => {
  const state = makeState()
  state.blocks.push({ ...state.blocks[0] })
  rejected(state, /unique/)
  for (const id of [-1, 0, 1.5, Number.MAX_SAFE_INTEGER + 1, '1']) rejected({ ...makeState(), blocks: [{ ...makeState().blocks[0], id }] }, /id/)
  rejected({ ...makeState(), blocks: [{ ...makeState().blocks[0], slug: 'made-up' }] }, /registry/)
})
test('property enums, numeric select strings and booleans are strict', () => {
  for (const values of [{ state: 'rest' }, { state: 'Invented' }, { count: 4 }, { enabled: 'true' }, { prompt: 42 }, { invented: true }]) {
    rejected({ ...makeState(), blocks: [{ ...makeState().blocks[0], values }] }, /must be|not supported/)
  }
  assert.equal(parse({ ...makeState(), blocks: [{ ...makeState().blocks[0], values: { count: '1' } }] }).ok, true)
})
test('live overrides use registry schema and reproduce effective values', () => {
  const state = makeState()
  state.blocks[0].live = { count: 1, state: 'Busy', enabled: false }
  const result = parse(state)
  assert.equal(result.ok, true)
  assert.deepEqual(effectiveValues(result.state.blocks[0]), { state: 'Busy', count: '1', enabled: false, prompt: '' })
  assert.throws(() => validateLiveValues({ state: ['Rest'] }, registry[0]), /must be/)
  assert.throws(() => validateLiveValues({ unknown: 'value' }, registry[0]), /not supported/)
  assert.throws(() => validateLiveValues({ count: 3 }, registry[0]), /must be/)
})
test('dangerous prototype keys and nonplain input objects are rejected', () => {
  const state = makeState()
  state.blocks[0].values = JSON.parse('{"__proto__":{"polluted":true}}')
  rejected(state, /not supported/)
  state.blocks[0].values = JSON.parse('{"constructor":"bad"}')
  rejected(state, /not supported/)
  assert.equal(validatePageState(new Date(), registry).ok, false)
  assert.equal({}.polluted, undefined)
})
test('block count, text length and payload size are bounded', () => {
  const state = makeState()
  state.blocks = Array.from({ length: MAX_BLOCKS + 1 }, (_, index) => ({ id: index + 1, slug: 'test-component', values: {}, live: {} }))
  rejected(state, /at most/)
  rejected({ ...makeState(), blocks: [{ ...makeState().blocks[0], values: { prompt: 'x'.repeat(20001) } }] }, /20,000/)
  assert.match(parsePageState(' '.repeat(2 * 1024 * 1024 + 1), registry).error, /2 MB/)
})
test('adding after an imported maximum ID does not overflow', () => {
  assert.equal(nextBlockId([]), 1)
  assert.equal(nextBlockId([{ id: 7 }]), 8)
  assert.equal(nextBlockId([{ id: Number.MAX_SAFE_INTEGER }, { id: 1 }]), 2)
})
test('AI contract is generated from registry, including enum values and empty-source state', () => {
  const prompt = aiPrompt(registry)
  assert.match(prompt, /"test-component"/)
  assert.match(prompt, /"Rest" \| "Busy"/)
  assert.match(prompt, /"1" \| "4"/)
  assert.match(prompt, /not a claimed Figma measurement/)
  assert.match(aiPrompt([]), /only valid blocks array is \[\]/)
})
test('HTML export helpers resolve local assets to current host and escape document titles', () => {
  assert.equal(resolveAssetUrl('figma/frame.png', 'http://localhost:5173/aigc/'), 'http://localhost:5173/aigc/figma/frame.png')
  assert.equal(resolveAssetUrl('/figma/frame.png', 'http://localhost:5173/aigc/'), 'http://localhost:5173/figma/frame.png')
  assert.equal(resolveAssetUrl('javascript:alert(1)', 'http://localhost:5173/'), '')
  assert.equal(resolveAssetUrl('#shape', 'http://localhost:5173/'), '#shape')
  assert.equal(escapeHtml('<script>"&\''), '&lt;script&gt;&quot;&amp;&#39;')
})
