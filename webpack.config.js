const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

const pages = path.resolve(__dirname, "src", "pages");

const PAGES = {
  common: path.resolve(pages, "common"),
  main: path.resolve(pages, "main"),
  geek: path.resolve(pages, "geek"),
  cv: path.resolve(pages, "cv"),
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      common: PAGES.common,
      main: PAGES.main,
      geek: PAGES.geek,
      cv: PAGES.cv,
    },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].bundle.js",
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("postcss-nested"), require("autoprefixer")],
              },
            },
          },
        ],
      },
      {
        test: /\.(html|svg)$/,
        loader: "raw-loader",
        include: pages,
      },
      {
        test: /\.ejs$/,
        loader: "ejs-loader",
        options: {
          esModule: false,
        },
      },
      {
        test: /\.(pdf|png)$/,
        type: "asset/resource",
        generator: {
          filename: "[path][name][ext]",
        },
        exclude: /(node_modules)/,
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].*\.js$/,
          chunks: "all",
        },
      },
    },
  },
  performance: {
    maxAssetSize: 500000,
    maxEntrypointSize: 500000,
    hints: isProduction ? 'warning' : false,
  },
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: "style.[contenthash].bundle.css",
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: "index.html",
      template: path.resolve(PAGES.main, "template.ejs"),
      chunks: ["common", "main"],
      loader: "ejs-loader",
      templateParameters: {
        _: require("lodash"),
      },
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: "geek.html",
      template: path.resolve(PAGES.geek, "template.ejs"),
      chunks: ["common", "geek"],
      loader: "ejs-loader",
      templateParameters: {
        _: require("lodash"),
      },
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: "cv.html",
      template: path.resolve(PAGES.cv, "template.ejs"),
      chunks: ["common", "cv"],
      loader: "ejs-loader",
      templateParameters: {
        _: require("lodash"),
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
          { from: 'static' }
      ]
  }),
    new CleanWebpackPlugin(),
  ],
  };
};
