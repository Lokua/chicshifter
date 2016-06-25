import Router from 'koa-router'
import render from './render'

const router = new Router()

const paths = [
  '/',
  '/home',
  '/about',
  '/issue',
  '/issue/*'
]

paths.map(path => router.get(path, render))

export default router
