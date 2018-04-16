const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
	mode: mode,
  entry: './public/js/application.js',
  output: {
    path: path.resolve(__dirname, 'public', 'js', 'dist'),
    filename: 'application.js',
  },
 devtool: mode === 'production' ? '' : 'inline-source-map',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};

