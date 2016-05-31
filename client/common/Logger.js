let _Logger = () => {}

if (process.env.NODE_ENV === 'development') {

  const Logger = require('lokua.net.logger')

  _Logger = function(name, color) {
    const opts = { level: Logger.DEBUG }
    if (color) opts.nameStyle = color
    return new Logger(name, opts)
  }

} else {
  const loggerMethods = ['log', 'trace', 'debug', 'info', 'warn', 'error']
  loggerMethods.forEach(m => _Logger.prototype[m] = () => {})
}

export default _Logger
