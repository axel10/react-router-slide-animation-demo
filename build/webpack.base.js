var webpack = require('webpack')


const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = process.argv.slice(-1)[0];

const devUrlLoader = "url-loader?limit=8192&name=[hash:8].[name].[ext]";
const prodUrlLoader = "url-loader?limit=8192&name=[hash:8].[name].[ext]&outputPath=assets/images/&publicPath=assets/images";

module.exports = {
  entry: {
    // app: ['babel-polyfill',path.resolve(__dirname, '../src/index.tsx')],
    app: path.resolve(__dirname, '../src/index.tsx'),
  },
  output: {
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "ts-loader"
          }
        ],
        include: [path.join(__dirname, "../src")]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          "css-loader?modules&localIdentName=[local]-[hash:base64:8]",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|woff|woff2|ttf|eot|svg)$/,
        loader: env === "development" ? devUrlLoader : prodUrlLoader
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: "file-loader"
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all'
        },
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: "style.css"
    }),
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, '../favicon.ico'),
      filename: "index.html",
      template: path.resolve(__dirname, "../public/index.html"),
      inject: true,
      hash: true,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  resolve: {
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
    alias: {
      '@': path.resolve(__dirname, "../src/")
    },
    modules: ['node_modules'],
  },
};
