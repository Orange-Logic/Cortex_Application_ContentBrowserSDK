/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  removeViteLogging,
  vitePlugin,
} from '@remcovaes/web-test-runner-vite-plugin';
import rollupCommonjs from '@rollup/plugin-commonjs';
import react from '@vitejs/plugin-react';
import { fromRollup } from '@web/dev-server-rollup';
import { playwrightLauncher } from '@web/test-runner-playwright';

import { glob } from 'glob';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';

const ignoreLitLogs = [
  'https://lit.dev/msg/dev-mode',
  'https://lit.dev/msg/change-in-update',
  'https://lit.dev/msg/no-override-create-property',
  'Multiple versions of Lit loaded.',
];

const commonjs = fromRollup(rollupCommonjs);
const tsPaths = fromRollup(tsconfigPaths);
let baseURL = process.env.CX_BASE_URL_PUBLIC;
const ignoreReact = process.env.CX_IGNORE_REACT ?? false;

if (!baseURL?.length) {
  baseURL = 'https://design-system.orangelogic.com/';
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getWebTestRunnerConfig = ({
  excludeCoverage = [],
  ignoreFiles = [],
  port,
}) => {
  return {
    browsers: [playwrightLauncher({ product: 'chromium' })],
    concurrentBrowsers: 3,
    coverage: true,
    coverageConfig: {
      exclude: ['**/*-example.ts', '**/api/**', ...excludeCoverage],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      report: true,
      reportDir: 'coverage',
      threshold: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    files: glob.sync('**/*.btest.ts', {
      ignore: [...(ignoreReact ? ['**/*.react.btest.ts'] : []), ...ignoreFiles],
    }),
    filterBrowserLogs: ({ args, type }) => {
      return (
        removeViteLogging({ args }) &&
        (type !== 'warn' ||
          !args.some((arg) => ignoreLitLogs.find((item) => arg.includes(item))))
      );
    },
    nodeResolve: {
      exportConditions: ['production', 'default'],
    },
    plugins: [
      vitePlugin({
        base: baseURL,
        envPrefix: 'CX_', // prefix for any env variables that will be exposed to the browser.
        mode: 'production',
        optimizeDeps: {
          exclude: ['.vite'],
          force: true,
          include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
            '@open-wc/testing',
            '@web/test-runner-commands',
            'sinon',
          ],
        },
        plugins: [tsconfigPaths(), react()],
        root: __dirname,
        server: {
          host: '127.0.0.1',
        },
      }),
      tsPaths(),
      commonjs({
        include: ['**/node_modules/**'],
      }),
    ],
    port: port,
    rootDir: './',
    testFramework: {
      config: {
        retries: 1,
        timeout: 10000,
      },
    },
    testRunnerHtml: (testFramework) => `
      <html lang="en-US">
        <head>
          <style rel="stylesheet" type="text/css" href="https://design-system.orangelogic.com/css/ol-base.css"></style>
          <style rel="stylesheet" type="text/css" href="https://design-system.orangelogic.com/css/ol-light.css"></style>
        </head>
        <body>
          <script>
            window.process = {env: { NODE_ENV: "production" }}
          </script>
          <script type="module" src="${testFramework}"></script>
        </body>
      </html>
    `,
  };
};

export default getWebTestRunnerConfig({
  excludeCoverage: ['**/src/**/base/**', '**/src/**/utils/**'],
});
