const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const Logger = require('lokua.net.node-logger')

const webpackConfig = require('./webpack.config.dev')
const config = require('../config')
const logger = new Logger('devServer', { format: ['name', 'level'] })

const host = config.devServer.host
const port = config.devServer.port

new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  inline: true,
  historyApiFallback: true,
  quiet: true,
  proxy: {
    '*': `http://localhost:${config.server.port}`
  },
  stats: {
    colors: true
  },
  headers: { 'Access-Control-Allow-Origin': '*' }
}).listen(port, host, (err/*, result*/) => {
  if (err) throw err

  logger.info(`Listening at ${host}:${port}`)
})
