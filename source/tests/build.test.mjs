import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { once } from 'node:events'
import { mkdtemp, readFile, rm, writeFile, mkdir, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { root, systems, filesIn, sha256, sourceFilter } from '../scripts/lib.mjs'
import { createStaticServer, normalizeBase } from '../scripts/serve.mjs'
import { removeTheme } from '../scripts/theme.mjs'

async function withServer(options, fn) {
  const server = await createStaticServer(options)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  try { await fn(server.address().port) }
  finally { await new Promise(resolve => server.close(resolve)) }
}
function request(port, path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path, method }, response => {
      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString() }))
    })
    req.once('error', reject)
    req.end()
  })
}

test('all copied source files are byte-identical to the recorded original hashes', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'ORIGINALS.json'), 'utf8'))
  assert.ok(manifest.files.length > 100)
  for (const entry of manifest.files) assert.equal(await sha256(join(root, entry.path)), entry.sha256, entry.path)
})

test('source packaging excludes dependencies, build outputs, archives and symlinks', async () => {
  const files = await filesIn(root, sourceFilter)
  assert.ok(files.includes('package.json'))
  assert.ok(files.includes('shell/index.html'))
  for (const file of files) {
    assert.doesNotMatch(file, /(^|\/)(node_modules|dist|\.git)(\/|$)|\.tsbuildinfo$/)
    assert.doesNotMatch(file, /design\/(inventory\.json|INVENTORY\.md|source-assets|figma-export|figma-context|figma-pages)|public\/figma\/(export|images)\//)
  }
  assert.ok(files.includes('projects/video/site/licenses/Roboto-LICENSE.txt'))
  for (const id of systems) assert.ok(files.includes(`projects/${id}/site/package-lock.json`))
})

test('combined build preserves child assets and only adds the reversible CSS theme to entry HTML', async () => {
  const dist = join(root, 'dist')
  assert.equal(await sha256(join(root, 'shell/index.html')), await sha256(join(dist, 'index.html')))
  const manifest = JSON.parse(await readFile(join(dist, 'BUILD-MANIFEST.json'), 'utf8'))
  const files = await filesIn(dist)
  assert.deepEqual(files.filter(file => file !== 'BUILD-MANIFEST.json'), Object.keys(manifest.files).sort())
  for (const [file, hash] of Object.entries(manifest.files)) assert.equal(await sha256(join(dist, file)), hash, file)
  for (const id of systems) {
    const source = join(root, 'projects', id, 'site', 'dist')
    const target = join(dist, 'systems', id)
    const originals = await filesIn(source)
    assert.deepEqual(await filesIn(target), originals)
    for (const file of originals) {
      if (file === 'index.html') {
        assert.equal(removeTheme(await readFile(join(target, file), 'utf8'), id), await readFile(join(source, file), 'utf8'))
      } else assert.equal(await sha256(join(source, file)), await sha256(join(target, file)), `${id}/${file}`)
    }
    assert.ok(originals.includes('index.html'))
  }
})

test('static serving supports the root, all 3 child websites, scripts and HEAD', async () => {
  await withServer({}, async port => {
    for (const path of ['/', ...systems.map(id => `/systems/${id}/`)]) {
      const result = await request(port, path)
      assert.equal(result.status, 200, path)
      assert.match(result.headers['content-type'], /text\/html/)
    }
    const script = await request(port, '/app.mjs')
    assert.equal(script.status, 200)
    assert.match(script.headers['content-type'], /text\/javascript/)
    const head = await request(port, '/', 'HEAD')
    assert.equal(head.status, 200)
    assert.equal(head.body, '')
    assert.ok(Number(head.headers['content-length']) > 0)
    assert.equal((await request(port, '/missing-route')).status, 404)
    assert.equal((await request(port, '/', 'POST')).status, 405)
  })
})

test('all production files load under a nested deployment base with correct entry resolution', async () => {
  await withServer({ base: '/library/design/' }, async port => {
    assert.equal((await request(port, '/')).status, 404)
    assert.equal((await request(port, '/library/design')).status, 308)
    assert.equal((await request(port, '/library/design/')).status, 200)
    const files = await filesIn(join(root, 'dist'))
    for (const file of files) {
      const result = await request(port, `/library/design/${file.split('/').map(encodeURIComponent).join('/')}`, 'HEAD')
      assert.equal(result.status, 200, file)
    }
    for (const id of systems) {
      const result = await request(port, `/library/design/systems/${id}/`)
      const references = [...result.body.matchAll(/(?:src|href)="(\.[^"]+)"/g)].map(match => match[1])
      assert.ok(references.length >= 1)
      for (const reference of references) {
        const url = new URL(reference, `http://127.0.0.1:${port}/library/design/systems/${id}/`)
        assert.equal((await request(port, url.pathname)).status, 200, `${id}: ${reference}`)
      }
    }
  })
})

test('static server rejects path traversal, malformed paths, and escaping symlinks', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'design-hub-server-'))
  await mkdir(join(temp, 'public'))
  await writeFile(join(temp, 'private.txt'), 'private')
  await writeFile(join(temp, 'public', 'index.html'), 'public')
  await symlink(join(temp, 'private.txt'), join(temp, 'public', 'escape.txt'))
  try {
    await withServer({ directory: join(temp, 'public') }, async port => {
      for (const path of ['/../private.txt', '/%2e%2e/private.txt', '/a/%2e%2e/%2e%2e/private.txt', '/escape.txt', '/a%5c..%5cprivate.txt', '//example.com']) {
        assert.equal((await request(port, path)).status, 403, path)
      }
      assert.equal((await request(port, '/bad%')).status, 400)
      assert.equal((await request(port, '/%00')).status, 403)
    })
  } finally { await rm(temp, { recursive: true, force: true }) }
  assert.throws(() => normalizeBase('/a/../b/'))
  assert.throws(() => normalizeBase('relative/'))
  assert.throws(() => normalizeBase('//example.com/'))
  assert.equal(normalizeBase('/example'), '/example/')
})
