import Logger from 'lokua.net.node-logger'

Logger.setDefaults({
  format: ['name', 'level']
})

if (process.env.TEST) Logger.off = true

export default Logger
