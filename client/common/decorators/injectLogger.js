import Logger from 'lokua.net.logger'

Logger.setDefaults({
  format: ['name', 'level'/*, 'source'*/],
  useAbsoluteSource: true,
  // newLine: true
})

const loggerMethods = ['log', 'trace', 'debug', 'info', 'warn', 'error']

export default function injectLogger(level = 0, color) {

  const addLogger = t => {
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
