const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')
const autoprefixer = require('autoprefixer')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    path.join(config.projectRoot, 'client/index.js')
  ],
  output: {
    path: config.assetsRoot,
    filename: 'bundle.js',
    publicPath: config.assetsRoot
  },
  resolve: require('./webpack.config.resolve'),
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`,
        BROWSER: `${false}`
      }
    }),
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader'
      },
      {
        test: /index\.scss$/,
        loader: ExtractTextPlugin.extract('style',
          'css?sourceMap!sass?sourceMap!postcss?sourceMap'
        )
      },
      {
        test: /\.scss$/,
        exclude: /index/,
        loader: ExtractTextPlugin.extract('style', [
          'css?sourceMap&modules&importLoaders=1' +
            '&localIdentName=[name]__[local]___[hash:base64:5]',
          '!sass?sourceMap',
          '!postcss?sourceMap'
        ].join(''))
      },
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(config.projectRoot, 'client')
      }
    ]
  },
  sassLoader: Object.assign({}, config.sass, {
    functions: require('o-')
  }),
  postcss() {
    return [autoprefixer]
  }
}
