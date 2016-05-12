const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const autoprefixer = require('autoprefixer')

module.exports = {
  devtool: 'inline',
  entry: [
    `webpack-dev-server/client?http://localhost:${config.devServer.port}`,
    'webpack/hot/only-dev-server',
    path.join(config.projectRoot, 'client/index.js')
  ],
  output: {
    path: path.join(config.projectRoot, 'dist'),
    filename: 'bundle.js',
    publicPath: `http://localhost:${config.devServer.port}/dist/`
  },
  resolve: require('./webpack.config.resolve'),
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`,
        BROWSER: `${true}`
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?modules&importLoaders=1' +
            '&localIdentName=[name]__[local]___[hash:base64:5]',
          'sass',
          'postcss'
        ]
      },
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(config.projectRoot, 'client')
      }
    ]
  },
  sassLoader: config.sass,
  postcss() {
    return [autoprefixer]
  }
}
