import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Script } from 'node:vm';
import { root, systems } from '../scripts/lib.mjs';
import { generateOverview } from '../scripts/generate-overview.mjs';

test('lightweight overview statistics are generated from the current real registries and adapters', async () => {
  await generateOverview({check:true});
});
test('split entry graphs have a bounded initial payload and resolve every deferred dependency', async () => {
  const manifest=JSON.parse(await readFile(join(root,'dist/BUILD-MANIFEST.json'),'utf8'));
  for(const id of systems){
    const bundle=manifest.bundles[id];
    assert.ok(bundle.initialBytes<250000, `${id}: initial bundle regressed above 250KB`);
    assert.ok(bundle.deferredFiles.length>=2, `${id}: routes are no longer deferred`);
    for(const [name,record] of Object.entries(bundle.graph)){
      record.dependencies.forEach(dep=>assert.ok(bundle.graph[dep],`${id}: unknown ${dep}`));
      if(record.file){
        assert.ok(bundle.deferredFiles.includes(record.file));
        const source=await readFile(join(root,'dist/systems',id,'assets',record.file),'utf8');
        new Script(source);
        assert.doesNotMatch(source,/\b__(?:SCOPE|GRAPH|INITIAL|ENTRY)__\b/);
      } else assert.ok(bundle.initialModules.includes(name));
    }
  }
});
