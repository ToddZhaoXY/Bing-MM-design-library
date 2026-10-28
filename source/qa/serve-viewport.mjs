import { createStaticServer } from '../scripts/serve.mjs';
const server = await createStaticServer({ directory: './qa' });
server.listen(5199, '127.0.0.1', () => console.log('Viewport fixture: http://127.0.0.1:5199/viewport.html'));
