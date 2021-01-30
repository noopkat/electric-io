const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const mode = process.env.NODE_ENV === "development" ? "development" : "production";

const baseConfiguration = {
  mode: mode,
  entry: "./public/js/main.js",
  output: {
    path: path.resolve(__dirname, "public", "js", "dist"),
    publicPath: "/dist/",
    filename: "[name].bundle.js"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      chartist$: "chartist/dist/chartist.min.js"
    },
    fallback: {
      fs: false
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
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      SIMULATING: process.env.SIMULATING
    })
  ]
};

module.exports = mode === "production"
  ? baseConfiguration
  : { ...baseConfiguration, devtool: "eval-source-map" };
