import path from 'path'
import Koa from 'koa'
import serve from 'koa-static'
import convert from 'koa-convert'
import cors from 'koa-cors'
import bodyParser from 'koa-bodyparser'
import _Logger from 'lokua.net.node-logger'

import config from '../config'
import Logger from './Logger'
import router from './router'
import api from './api'
import errorHandler from './middleware/errorHandler'

const app = new Koa()
const logger = new Logger('server')

const { projectRoot } = config
const { host, port } = config.server

// allow both legacy and modern middleware
// https://www.npmjs.com/package/koa-convert
const use = app.use;
app.use = x => use.call(app, convert(x))

app.use(_Logger.koaLogger('request', {
  level: process.env.TEST
    ? -1
    : process.env.NODE_ENV === 'development'
      ? Logger.DEBUG
      : Logger.INFO,
  format: ['name']
}))

app.use(cors())
app.use(bodyParser())
app.use(errorHandler)
app.use(serve(path.join(projectRoot, 'dist')))
app.use(serve(path.join(projectRoot, 'assets')))

app.use(router.routes())
app.use(api.routes())

if (!+process.env.TEST) {
  app.listen(port, host, () => logger.info(`Listening at ${host}:${port}`))
}

export default app
