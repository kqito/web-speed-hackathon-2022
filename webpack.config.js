/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const safePostCssParser = require("postcss-safe-parser");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const nodeExternals = require("webpack-node-externals");

function abs(...args) {
  return path.join(__dirname, ...args);
}

const SRC_ROOT = abs("./src");
const PUBLIC_ROOT = abs("./public");
const DIST_ROOT = abs("./dist");
const DIST_PUBLIC = abs("./dist/public");

const createBase = ({ isClient }) => ({
  devtool: false,
  optimization: {
    minimize: isClient,
    minimizer: isClient
      ? [new TerserPlugin(), new CssMinimizerPlugin()]
      : undefined,
    splitChunks: {
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        defaultVendors: {
          priority: -10,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: "all",
      enforceSizeThreshold: 50000,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      minChunks: 1,
      minRemainingSize: 0,
      minSize: 20000,
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: PUBLIC_ROOT, to: DIST_PUBLIC }],
    }),
    process.env.ANALYZER === "true" &&
      new BundleAnalyzerPlugin({
        analyzerPort: isClient ? 8887 : 8889,
      }),
    new webpack.ProvidePlugin({
      // $: 'jquery',
      // AudioContext: ['standardized-audio-context', 'AudioContext'],
      Buffer: ["buffer", "Buffer"],
      // 'window.jQuery': 'jquery',
    }),
    new webpack.EnvironmentPlugin({
      BUILD_DATE: new Date().toISOString(),
      // Heroku では SOURCE_VERSION 環境変数から commit hash を参照できます
      COMMIT_HASH: process.env.SOURCE_VERSION || "",
      NODE_ENV: "production",
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[name].css",
    }),
    // new MiniCssExtractPlugin(), こっちかも
    new HtmlWebpackPlugin({
      inject: true,
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
      template: path.resolve(SRC_ROOT, "./templates/index.html"),
    }),
  ].filter(Boolean),
});

/** @type {Array<import('webpack').Configuration>} */
module.exports = [
  {
    ...createBase({ isClient: true }),
    entry: path.join(SRC_ROOT, "client/index.jsx"),
    mode: "production",
    module: {
      rules: [
        // {
        //   test: /.s?css$/,
        //   use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        // },
        {
          resourceQuery: (value) => {
            const query = new URLSearchParams(value);
            return query.has("raw");
          },
          type: "asset/source",
        },
        {
          exclude: /node_modules/,
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "babel-plugin-styled-components",
                  {
                    pure: true,
                  },
                ],
              ],
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // spec: true,
                    loose: true,
                    modules: false,
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        },
      ],
    },
    name: "client",
    output: {
      path: DIST_PUBLIC,
    },
    // output: {
    //   filename: "[name].js",
    //   path: DIST_ROOT,
    // },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    target: "web",
  },
  {
    ...createBase({ isClient: false }),
    entry: path.join(SRC_ROOT, "server/index.js"),
    externals: [nodeExternals()],
    mode: "production",
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.(js|mjs|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "babel-plugin-styled-components",
                  {
                    pure: true,
                  },
                ],
              ],
              presets: [
                [
                  "@babel/preset-env",
                  {
                    loose: true,
                    modules: "cjs",
                    // spec: true,
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        },
      ],
    },
    name: "server",
    output: {
      filename: "[name].js",
      path: DIST_ROOT,
    },
    resolve: {
      extensions: [".mjs", ".js", ".jsx"],
    },
    target: "node",
  },
];
