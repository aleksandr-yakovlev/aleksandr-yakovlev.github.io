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

module.exports = {
  entry: {
    common: PAGES.common,
    main: PAGES.main,
    geek: PAGES.geek,
    cv: PAGES.cv,
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[hash].bundle.js",
  },
  devServer: {
    contentBase: "dist",
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
        test: /\.(pdf|png)$/,
        use: "file-loader?name=[path][name].[ext]",
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
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: "style.[hash].bundle.css",
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      filename: "index.html",
      template: path.resolve(PAGES.main, "template.ejs"),
      chunks: ["common", "main"],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      filename: "geek.html",
      template: path.resolve(PAGES.geek, "template.ejs"),
      chunks: ["common", "geek"],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      filename: "cv.html",
      template: path.resolve(PAGES.cv, "template.ejs"),
      chunks: ["common", "cv"],
    }),
    new CopyWebpackPlugin({
      patterns: [
          { from: 'static' }
      ]
  }),
    new CleanWebpackPlugin(),
  ],
};
