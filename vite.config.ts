import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // React and some dependencies read `process.env.NODE_ENV`; browsers have no `process`.
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV ?? 'production',
    ),
  },
  plugins: [
    react({
      include: '**/*.{jsx,js,tsx,ts}',
      babel: {
        babelrc: false,
        configFile: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public',
  server: {
    port: 3000,
  },
  build: {
    target: 'es2016',
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index-umd.tsx'),
      name: 'OrangeDAMContentBrowserSDK',
      formats: ['umd'],
      fileName: () => 'OrangeDAMContentBrowserSDK.min.js',
    },
    rollupOptions: {
      // Never externalize for UMD: `package.json` peers must still be inlined here so a
      // single script tag works. (Otherwise Rollup may omit `node_modules` graph that peers
      // resolve to, or aggressive tree-shaking can drop Lit `customElement` side effects.)
      external: () => false,
      treeshake: false,
      // Named-import / ESM consumers use `index.mjs` (vite.esm.config.ts) where DS is a peer.
      output: {
        inlineDynamicImports: true,
        exports: 'default',
        assetFileNames: 'OrangeDAMContentBrowserSDK.min.css',
        footer:
          ';(function(g){try{var s=g&&g.OrangeDAMContentBrowserSDK;if(s)g.OrangeDAMContentBrowser=g.OrangeDAMContentBrowser||s;}catch(_){}})(typeof globalThis!=="undefined"?globalThis:typeof window!=="undefined"?window:void 0);',
      },
    },
  },
});
