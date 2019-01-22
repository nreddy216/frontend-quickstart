const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

// TODO: (@nidhireddy) Split this config up into dev and prod files
let minimizerPlugins = [new OptimizeCSSAssetsPlugin()];

const prodMinimizerPlugins = [
   new TerserPlugin({
      terserOptions: {
         output: {
            comments: /@preserve/i
         }
      },
      extractComments: false
   }),
   new JavaScriptObfuscator({
      rotateUnicodeArray: true
   })
];

let plugins = [
   new HtmlWebpackPlugin({
      inject: true,
      template: 'static/index.html'
   }),
   new MiniCssExtractPlugin({
      filename: '[name].css'
   }),
   new CopyWebpackPlugin([
      { from: 'static/', to: 'static/' },
      { from: 'static/images/favicon.png', to: '' }
   ])
];

const devPlugins = [new webpack.HotModuleReplacementPlugin()];

const prodPlugins = [new CleanWebpackPlugin(['build'])];

module.exports = env => {
   if (env.production) {
      minimizerPlugins = [...prodMinimizerPlugins, ...minimizerPlugins];
      plugins = [...plugins, ...prodPlugins];
   } else {
      plugins = [...plugins, ...devPlugins];
   }

   return {
      entry: './src/js/index.js',
      devtool: 'inline-source-map',
      devServer: {
         hot: true,
         watchContentBase: true,
         compress: true,
         port: 8080
      },
      optimization: {
         minimizer: minimizerPlugins
      },
      plugins: plugins,
      module: {
         rules: [
            {
               test: /\main.sass$/,
               use: [
                  MiniCssExtractPlugin.loader,
                  {
                     loader: 'css-loader',
                     options: {
                        minimize: {
                           safe: true
                        }
                     }
                  },
                  {
                     loader: 'postcss-loader',
                     options: {
                        plugins: () => [
                           autoprefixer({
                              browsers: ['> 1%', 'last 2 versions']
                           })
                        ]
                     }
                  },
                  {
                     loader: 'sass-loader',
                     options: {}
                  }
               ]
            },
            {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                  loader: 'babel-loader',
                  options: {
                     presets: ['@babel/preset-env']
                  }
               }
            },
            {
               test: /.*\.(gif|png|jpe?g|svg)$/i,
               use: [
                  {
                     loader: 'file-loader?name=static/images/[name].[ext]'
                  },
                  {
                     loader: 'image-webpack-loader',
                     options: {
                        optipng: {
                           optimizationLevel: 7
                        },
                        pngquant: {
                           quality: '65-90'
                        },
                        mozjpeg: {
                           quality: 65
                        }
                     }
                  }
               ]
            }
         ]
      },
      output: {
         filename: 'main.bundle.js',
         path: path.resolve(__dirname, 'build')
      }
   };
};