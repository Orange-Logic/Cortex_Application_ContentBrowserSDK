import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * ESM subpath `…/dam-view` — Lit `CxDamView` only (no Content Browser React shell).
 * Peers and externals match `vite.esm.config.ts`.
 */
export default defineConfig({
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
  publicDir: false,
  build: {
    target: 'es2016',
    outDir: 'build',
    emptyOutDir: false,
    sourcemap: false,
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/dam-view.ts'),
      formats: ['es'],
      fileName: () => 'dam-view.mjs',
    },
    rollupOptions: {
      external: (id: string) => {
        return (
          id === '@orangelogic/design-system' ||
          id.startsWith('@orangelogic/design-system/')
        );
      },
      output: {
        inlineDynamicImports: true,
        exports: 'named',
        assetFileNames: 'dam-view.css',
      },
    },
  },
});
