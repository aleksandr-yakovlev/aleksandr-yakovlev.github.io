const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

const pages = path.resolve(__dirname, "src", "pages");

const PAGES = {
  main: path.resolve(pages, "main"),
  geek: path.resolve(pages, "geek"),
};

module.exports = {
  entry: {
    main: PAGES.main,
    geek: PAGES.geek,
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
        test: /\.html$/,
        loader: "raw-loader",
        include: path.resolve(pages, "includes"),
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
      template: path.resolve(PAGES.main, "template.html"),
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      filename: "geek.html",
      template: path.resolve(PAGES.geek, "template.html"),
      chunks: ["geek"],
    }),
    new CleanWebpackPlugin(),
  ],
};
