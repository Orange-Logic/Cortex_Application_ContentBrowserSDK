import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsc = path.join(root, 'node_modules/typescript/lib/tsc.js');
const tscAlias = path.join(root, 'node_modules/tsc-alias/dist/bin/index.js');
const config = path.join(root, 'tsconfig.build.json');

const opts = { cwd: root, stdio: 'inherit' };

function check(result, label) {
  if (result.error) {
    console.error(`[emit-types] ${label} failed:`, result.error);
    process.exit(1);
  }
  if (result.signal) {
    console.error(`[emit-types] ${label} terminated by signal ${result.signal}`);
    process.exit(1);
  }
  if (typeof result.status === 'number' && result.status !== 0) {
    console.error(`[emit-types] ${label} exited with code ${result.status}`);
    process.exit(result.status);
  }
}

check(spawnSync(process.execPath, [tsc, '-p', config], opts), 'tsc');
check(spawnSync(process.execPath, [tscAlias, '-p', config], opts), 'tsc-alias');
