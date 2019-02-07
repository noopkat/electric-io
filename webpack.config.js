const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";

module.exports = {
  mode: mode,
  entry: "./public/js/main.js",
  output: {
    path: path.resolve(__dirname, "public", "js", "dist"),
    publicPath: "/dist/",
    chunkFilename: "[name].bundle.js",
    filename: "[name].bundle.js"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  devtool: mode === "production" ? "" : "eval-source-map",
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      SIMULATING: process.env.SIMULATING
    })
  ],
  node: {
    fs: "empty"
  }
};
