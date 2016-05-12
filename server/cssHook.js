const cssHook = require('css-modules-require-hook')
const config = require('../config')

cssHook({
  extensions: ['.scss'],
  ignore: /index\.scss$/,

  preprocessCss(css, filename) {

    if (process.env.NODE_ENV === 'development') {
      const sass = require('node-sass')
      const result = sass.renderSync(Object.assign({}, config.sass, {
        data: css
      }))

      return result.css
    }

    return css
  },

  generateScopedName: (() => {

    // enable us to use enzyme's .find in tests
    if (process.env.TEST) return '[local]'

    return '[name]__[local]___[hash:base64:5]'
  })()

  // generateScopedName(name, filepath, css) {
  // }
})
