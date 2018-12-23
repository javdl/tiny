const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].bundle.[chunkhash].js',
    chunkFilename: '[id].bundle.[chunkhash].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
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
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                /* eslint-disable global-require */
                require('autoprefixer'),
                require('cssnano')
              ]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
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
                )}${svgPath.substr(-4)}`,
              runtimeCompat: true
            }
          },
          'svgo-loader'
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
            loader: 'webp-loader?{quality: 90}'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Also generate a test.html
      filename: '404.html',
      template: 'src/404.html',
      inject: false,
      minify: {
        collapseInlineTagWhitespace: true,
        minifyCSS: true,
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new InjectManifest({
      swSrc: './src/sw.js',
      swDest: path.join(process.cwd(), 'site/assets/sw.js'),
      importWorkboxFrom: 'local',
      // Exclude image and inline resources from the precache
      exclude: [/\.(?:png|jpe?g|webp|svg|css)$/]
    }),
    new WebpackShellPlugin({
      onBuildEnd: ['hugo --minify -s site/ -d ../dist']
    })
  ]
});
