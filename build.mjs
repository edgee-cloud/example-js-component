import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { componentize } from '@bytecodealliance/componentize-js';

const componentSource = await readFile('src/index.js', 'utf-8');

const { component } = await componentize(componentSource, {
  witPath: resolve('./wit/protocols.wit'),
  worldName: 'data-collection',
  enableAot: process.env.ENABLE_AOT == '1',
  disableFeatures: [ 'http' ],
});

await writeFile('example-js-component.wasm', component);
