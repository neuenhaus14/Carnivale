const HtmlWebpackPlugin = require('html-webpack-plugin');
//import HtmlWebpackPlugin from 'html-webpack-plugin';
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
//import WebpackBar from 'webpackbar'
const path = require('path');
//import path from 'path'
//import { fileURLToPath } from 'url';
const Dotenv = require('dotenv-webpack');
//import Dotenv from 'dotenv-webpack'
const autoprefixer = require('autoprefixer');
//import autoprefixer from 'autoprefixer'
require("dotenv").config()
const {NODE_ENV = "production"} = process.env
const isDev = NODE_ENV.includes("dev")

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, 'client');
const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {

  entry: {
    app: path.resolve(SRC_DIR, 'index.tsx'),
  },

  output: {
    path: DIST_DIR,
    filename: '[name].bundle.js',
  },
  mode: isDev ? "development" : "production", 
  devtool: isDev ? "inline-source-map" : "source-map",  

  plugins: [
    // Creates a loading bar
    new WebpackBar(),
    // Clears files in ./dist
    // new CleanWebpackPlugin(),
    // generates an html file from template
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_DIR, 'index.html'),
    }),

    new Dotenv()
  ],

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
      { //for typescript
        test: /\.tsx?$/, //match the least number of files it needs to 
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/, //look through files if end in js or jsx run with babel loader
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
                plugins: [
                  autoprefixer,
                ],
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
        "os": false,
        "path": false,
        "crypto": false
      }
  },
}