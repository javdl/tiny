const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }, // svg sprite
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, './src/img/icons/utils'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: svgPath =>
                `../site/assets/sprite_${path.basename(
                  path.dirname(svgPath)
                )}${svgPath.substr(-4)}`
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png)$/i,
        exclude: path.resolve(__dirname, './src/img/icons'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].webp'
            }
          },
          {
            loader: 'webp-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      // Also generate a test.html
      filename: '404.html',
      template: 'src/404.html',
      inject: false
    }),
    new WebpackShellPlugin({
      onBuildEnd: ['hugo server -D -s site/ -d ../dist']
    })
  ]
});
