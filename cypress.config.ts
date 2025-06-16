/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress';
import path from 'path';
process.env.NODE_ENV = 'test'; 
export default defineConfig({
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: {
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          alias: {
            '@': path.resolve(__dirname, './src'), // adjust if your src is in a different folder
          },
        },
        mode: 'development',
        devtool: false,
        module: {
          rules: [
            // application and Cypress files are bundled like React components
            // and instrumented using the babel-plugin-istanbul
            // (we will filter the code coverage for non-application files later)
            {
              test: /\.(ts|tsx|js|jsx)?$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { runtime: 'automatic' }],
                    '@babel/preset-typescript',
                  ],
                  plugins: [
                    // we could optionally insert this plugin
                    // only if the code coverage flag is on
                    'babel-plugin-istanbul',
                  ],
                },
              },
            },
          ],
        },
      },
    },
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      on('task', {
        log: message => {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
