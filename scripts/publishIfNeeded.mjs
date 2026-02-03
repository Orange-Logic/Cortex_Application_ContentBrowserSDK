#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { argv } from 'node:process';
import { realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const nodePath = await realpath(argv[1]);
const modulePath = await realpath(fileURLToPath(import.meta.url));
const isCLI = nodePath === modulePath;

export async function publish() {
  const [remoteVersionsResult, newVersionResult] = await Promise.all([
    execAsync('npm view . versions --json'),
    execAsync('npm pkg get version --json'),
  ]);

  const remoteVersions = JSON.parse(remoteVersionsResult.stdout);
  const version = JSON.parse(newVersionResult.stdout);

  if (remoteVersions.includes(version)) {
    console.log(`Skipping version ${version} because it's already published`);
    return;
  }

  console.log(`Publishing version ${version}`);
  await execAsync('npm publish');
}

export async function cliPublish() {
  const { values } = parseArgs({
    options: {},
    strict: false,
    allowPositionals: true,
  });

  await publish(values);
}

if (isCLI) cliPublish();
