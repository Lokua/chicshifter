import Logger from 'lokua.net.node-logger'

Logger.setDefaults({
  format: ['name', 'level']
})

if (process.env.TEST) {
  Logger.off = true
}

export default function(name, level) {

  if (level === undefined) {
    if (process.env.NODE_ENV === 'development') {
      level = Logger.DEBUG
    }

    level = Logger.INFO
  }

  return new Logger(name, level)
}
