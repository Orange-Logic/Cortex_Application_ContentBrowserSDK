/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: webpackConfig => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin',
      );
      const miniCssExtractPluginIndex = webpackConfig.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'MiniCssExtractPlugin',
      );
      
      webpackConfig.plugins[miniCssExtractPluginIndex].options.filename = 'OrangeDAMContentBrowserSDK.min.css';

      delete webpackConfig.output.chunkFilename;

      const terserPluginIndex = webpackConfig.optimization.minimizer.findIndex(
        ({ constructor }) => constructor && constructor.name === 'TerserPlugin',
      );
      webpackConfig.optimization.minimizer[terserPluginIndex].options.extractComments = false;

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      webpackConfig.optimization.minimizer.push(
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      );

      webpackConfig.output = {
        path: path.resolve(__dirname, 'build'),
        filename: 'OrangeDAMContentBrowserSDK.min.js',
        library: {
          name: 'OrangeDAMContentBrowserSDK',
          type: 'umd',
          export: 'default',
        },
        globalObject: 'this',
        publicPath: '',
      };

      return webpackConfig;
    },
  },
};
