let Logger
const loggerMethods = ['log', 'trace', 'debug', 'info', 'warn', 'error']

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  Logger = require('lokua.net.logger')
  Logger.setDefaults({
    format: ['name', 'level'/*, 'source'*/],
    useAbsoluteSource: true
  })
}

export default function injectLogger(level = 0, color) {

  const addLogger = t => {

    // noopify all logger method calls
    if (!isDev) {
      loggerMethods.forEach(m => t.prototype[m] = () => {})
      return
    }

    const options = { level }
    if (color) options.nameStyle = `color:${color}`
    const logger = new Logger(t.name, options)
    loggerMethods.forEach(m => t.prototype[m] = logger[m].bind(logger))
    t.prototype.logger = logger
  }

  // called with no parens
  if (arguments.length === 1 && typeof arguments[0] !== 'number') {
    addLogger(arguments[0])
  } else {
    return target => addLogger(target)
  }
}
