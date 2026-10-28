import { createStaticServer } from '../scripts/serve.mjs';

const directory = process.argv[2] || './dist';
const port = Number(process.argv[3] || 5197);
const base = process.argv[4] || '/';
const blockBundle = process.argv.includes('--block-app');
const server = await createStaticServer({ directory, base });
server.prependListener('request', (request, response) => {
  response.setHeader('Content-Security-Policy', "frame-src 'none'; object-src 'none'; base-uri 'self'");
  response.setHeader('X-Frame-Options', 'DENY');
  if (blockBundle && /-classic\.js(?:\?|$)/.test(request.url)) request.url = `${base}__missing_app_for_qa__.js`;
});
server.listen(port, '127.0.0.1', () => console.log(`Frame-restricted QA: http://127.0.0.1:${port}${base}`));
