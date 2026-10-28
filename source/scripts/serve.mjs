import http from 'node:http'
import { createReadStream } from 'node:fs'
import { realpath, stat } from 'node:fs/promises'
import { extname, join, relative, sep } from 'node:path'
import { root, isMain } from './lib.mjs'

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.pdf': 'application/pdf', '.zip': 'application/zip',
}
export function normalizeBase(base = '/') {
  if (!base.startsWith('/') || base.includes('//') || /[\\?#%\0]/.test(base) || base.split('/').some(p => p === '..' || p === '.')) {
    throw new Error('--base must be an absolute URL path without query, hash, encoding or traversal')
  }
  return base === '/' ? '/' : `${base.replace(/\/+$/, '')}/`
}
export async function createStaticServer({ directory = join(root, 'dist'), base = '/' } = {}) {
  const mount = normalizeBase(base)
  const diskRoot = await realpath(directory)
  return http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Cache-Control', 'no-cache')
    function fail(status, text) {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end(request.method === 'HEAD' ? undefined : text)
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD')
      fail(405, 'Method not allowed')
      return
    }
    let path
    try { path = decodeURIComponent(request.url.split('?')[0]) }
    catch { fail(400, 'Invalid URL encoding'); return }
    if (path.includes('\\') || path.includes('//') || path.includes('\0') || path.split('/').some(p => p === '..' || p === '.')) {
      fail(403, 'Forbidden'); return
    }
    if (mount !== '/' && path === mount.slice(0, -1)) {
      response.writeHead(308, { Location: mount }); response.end(); return
    }
    if (!path.startsWith(mount)) { fail(404, 'Not found'); return }
    const suffix = path.slice(mount.length)
    let candidate = join(diskRoot, suffix)
    try {
      const info = await stat(candidate)
      if (info.isDirectory()) {
        if (!path.endsWith('/')) {
          response.writeHead(308, { Location: `${encodeURI(path)}/` }); response.end(); return
        }
        candidate = join(candidate, 'index.html')
      }
      const resolved = await realpath(candidate)
      const local = relative(diskRoot, resolved)
      if (local === '..' || local.startsWith(`..${sep}`)) { fail(403, 'Forbidden'); return }
      const file = await stat(resolved)
      if (!file.isFile()) { fail(404, 'Not found'); return }
      response.writeHead(200, { 'Content-Type': types[extname(resolved).toLowerCase()] || 'application/octet-stream', 'Content-Length': file.size })
      if (request.method === 'HEAD') { response.end(); return }
      createReadStream(resolved).on('error', () => response.destroy()).pipe(response)
    } catch (error) {
      fail(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500, 'Not found')
    }
  })
}
if (isMain(import.meta.url)) {
  let port = 5196
  let base = '/'
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port') port = Number(args[++i])
    else if (args[i] === '--base') base = args[++i]
    else throw new Error('Usage: node scripts/serve.mjs [--port 5196] [--base /design-hub/]')
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid --port')
  base = normalizeBase(base)
  const server = await createStaticServer({ base })
  server.on('error', error => { console.error(error.message); process.exitCode = 1 })
  server.listen(port, '127.0.0.1', () => console.log(`Design Systems Portal → http://127.0.0.1:${port}${base}`))
}
