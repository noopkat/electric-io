const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const mode =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
  mode: mode,
  entry: './public/js/application.js',
  output: {
    path: path.resolve(__dirname, 'public', 'js', 'dist'),
    filename: 'application.js'
  },
  devtool: mode === 'production' ? '' : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
     'vue$': 'vue/dist/vue.esm/js'
    }
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.vue$/, loader: 'vue-loader' }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      SIMULATING: process.env.SIMULATING
    })
  ]
};
