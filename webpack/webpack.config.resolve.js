const path = require('path')
const config = require('../config')

module.exports = {
  resolve: {
    alias: {
      '@components': path.join(config.clientRoot, '/components/'),
      '@common': path.join(config.clientRoot, '/common/'),
      '@styles': path.join(config.clientRoot, 'styles')
    },
    extensions: ['', '.js', '.jsx']
  }
}
