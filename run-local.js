'use strict';

import 'dotenv/config';
import { readFile } from 'fs/promises';

const [path] = process.argv.slice(2);

if (!path) {
  console.error('You need to provide function name as first argument');
  process.exit(0);
}

const { handler } = await import(`./${path}/index.js`);

let event = {};
try {
  event = JSON.parse(await readFile(new URL(`./${path}/event.json`, import.meta.url)));
} catch (e) {
  console.log('Event file not found');
}

process.env.LOCAL = 1;

const response = await handler(event);
console.log(response);
