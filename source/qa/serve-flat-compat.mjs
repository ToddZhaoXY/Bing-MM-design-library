import { createStaticServer } from '../scripts/serve.mjs';

const [directory, port = '5205', base = '/published/design/', mode = 'normal'] = process.argv.slice(2);
if (!directory || !['normal', 'missing', 'html', 'policy'].includes(mode)) throw new Error('Usage: node qa/serve-flat-compat.mjs DIRECTORY PORT BASE [normal|missing|html|policy]');
const server = await createStaticServer({ directory, base });
server.prependListener('request', (request, response) => {
  response.setHeader('Content-Security-Policy', `base-uri 'none'; frame-src 'none'; object-src 'none'; script-src 'self'${mode === 'policy' ? "; script-src-elem 'none'" : ''}`);
  response.setHeader('X-Frame-Options', 'DENY');
  if (request.url.slice(base.length).includes('/')) request.url = base + '__nested_files_not_supported__';
  if (/-app-[\w]+\.js(?:\?|$)/.test(request.url)) {
    if (mode === 'missing') request.url = base + '__missing_app__.js';
    if (mode === 'html') request.url = base + 'index.html';
  }
});
server.listen(Number(port), '127.0.0.1', () => console.log(`Flat compatibility QA (${mode}): http://127.0.0.1:${port}${base}`));
