const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  entry: './public/js/application.js',
  output: {
    path: path.resolve(__dirname, 'public', 'js', 'dist'),
    filename: 'application.js',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};

