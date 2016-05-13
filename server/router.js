import Router from 'koa-router'
import render from './render'

const router = new Router()

;['/', '/home', '/about', '/issue', '/issue/*', '/style-guide']
  .map(path => router.get(path, render))

export default router
