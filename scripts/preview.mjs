import { createStaticServer } from '../source/scripts/serve.mjs';
import { repository } from './verify-site.mjs';

const base = '/Bing-MM-design-library/';
const server = await createStaticServer({ directory: repository, base });
server.listen(5198, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:5198${base}`));
