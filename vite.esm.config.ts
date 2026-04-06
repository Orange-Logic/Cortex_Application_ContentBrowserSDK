import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * ESM library build → `build/index.mjs` (`import …`, `import { CxDamView } …`).
 * `@orangelogic/design-system` is external (peer); the app must install it.
 * UMD (`OrangeDAMContentBrowserSDK.min.js`) bundles the design system — see vite.config.ts.
 * Run after UMD so `build/` is not wiped.
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
      entry: path.resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: () => 'index.mjs',
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
        assetFileNames: 'index.css',
      },
    },
  },
});
