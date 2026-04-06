import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsc = path.join(root, 'node_modules/typescript/lib/tsc.js');
const tscAlias = path.join(root, 'node_modules/tsc-alias/dist/bin/index.js');
const config = path.join(root, 'tsconfig.build.json');

const opts = { cwd: root, stdio: 'inherit' };

spawnSync(process.execPath, [tsc, '-p', config], opts);
spawnSync(process.execPath, [tscAlias, '-p', config], opts);
