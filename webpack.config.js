const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');
const DotenvWebpack = require('dotenv-webpack');
const autoprefixer = require('autoprefixer');

require('dotenv').config();

const { NODE_ENV = 'production' } = process.env;
const isDev = NODE_ENV.includes('dev');

const SRC_DIR = path.resolve(__dirname, 'client');
const DIST_DIR = path.resolve(__dirname, 'dist');

const allPlugins = [
  // generates html to add to dist
  new HtmlWebpackPlugin({
    template: path.resolve(SRC_DIR, 'index.html'),
  }),
  // imports environment variables into client-side
  new DotenvWebpack(),
];

module.exports = {
  entry: {
    app: path.resolve(SRC_DIR, 'index.tsx'),
  },

  output: {
    path: DIST_DIR,
    filename: '[name].bundle.js',
    clean: true,
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : 'source-map',

  plugins: isDev
    ? allPlugins.concat([
        // Add plugins for development
        // Creates a loading bar
        new WebpackBar(),
        // Generates bundle analyzer
        // new BundleAnalyzerPlugin(),
      ])
    : allPlugins,

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|jpg|png|mp3|aac|ogg)$/,
        type: 'asset/resource',
      },
      {
        //for typescript
        test: /\.tsx?$/, //match the least number of chars it needs
        use: 'ts-loader',
        exclude: [/node_modules/, /test/],
      },
      {
        // all js|x and ts|x files handled by babel, check babel.config.js
        // to check presets (typescript preset handles ts and js files)
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader',
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader',
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      // "fs": false,
      os: false,
      path: false,
      crypto: false,
    },
  },
};
