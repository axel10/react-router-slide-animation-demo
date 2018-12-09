const webpack = require('webpack');


const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const commonConfig = require("./webpack.base.js");

module.exports = function() {
  return merge(commonConfig, {
    cache: false,
    output: {
      path: path.join(__dirname, "/../dist/"),
      filename: "js/[name].js"
    },
    optimization: {
      minimize: true
    },
    plugins: [
      new CleanWebpackPlugin(["dist"], {
        root: path.resolve(__dirname, "..")
      }),
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, "../public"),
        to: path.resolve(__dirname, "../dist")
      }], { ignore: ["index.html"] }),
      new BundleAnalyzerPlugin(),

      new webpack.DefinePlugin({
        ISPROD: JSON.stringify(true),
        ISDEV: JSON.stringify(false)
      })
    ],
    externals: {
      "react-dom": "ReactDOM",
      "react": "React",
      "lodash": "_",
      "react-router": "ReactRouter",
      "react-router-dom": "ReactRouterDOM",
      "swiper": "Swiper"
    },
    mode: "production"
  });
};
