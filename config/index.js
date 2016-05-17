const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const clientRoot = path.resolve(projectRoot, 'client')
const assetsRoot = path.resolve(projectRoot, 'assets')
const dataRoot = path.resolve(assetsRoot, 'data')

module.exports = {
  projectRoot,
  clientRoot,
  assetsRoot,
  dataRoot,
  server: {
    host: '0.0.0.0',
    port: 3000,
    bundle: process.env.NODE_ENV === 'development'
      ? `http://localhost:${3001}/assets/bundle.js`
      : '/static/bundle.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 3001
  },
  sass: {
    includePaths: [
      path.join(projectRoot, 'node_modules'),
      path.join(clientRoot, 'styles')
    ],
    functions: process.env.NODE_ENV === 'development' ? require('o-') : null
  }
}
