import fs from 'mz/fs'
import path from 'path'
import Router from 'koa-router'
import marked from 'marked'

import config from '../../config'
import { createToken, verifyToken } from '../util'
import cache from '../cache'
import Logger from '../Logger'

const logger = new Logger('api')

const api = new Router({ prefix: '/api' })

// TODO: delete me
const renderer = new marked.Renderer()
renderer.heading = function(text, level) {
  return `<h${level}>${text}</h${level}>\n`
}
marked.setOptions({ renderer })

// PUBLIC

api.post('/login', async ctx => {
  const { username, password } = ctx.request.body

  if (username !== process.env.CHIC_USERNAME ||
      password !== process.env.CHIC_PASSWORD) {
    return ctx.status = 401
  }

  const token = createToken()

  if (verifyToken(token)) {
    logger.debug('setting token cookie...')

    ctx.cookies.set('token', token, {
      httpOnly: false
    })

    return ctx.status = 200
  }

  ctx.status = 500
  ctx.body = 'Could not create a verifiable token!'
})

api.get('/issues', async ctx => {
  ctx.body = await getIssues()
})

api.get('/fpfys', async ctx => {
  ctx.body = await getFpfys()
})

api.post('/fpfys/vote', async ctx => {
  const votesPath = path.join(config.dataRoot, 'votes.json')
  const votes = require(votesPath) || {}
  const { fpfyId, vote } = ctx.request.body
  if (!votes[fpfyId]) {
    votes[fpfyId] = { pas: 0, yea: 0 }
  }
  votes[fpfyId][vote ? 'yea' : 'pas' ]++
  ctx.body = votes
  await fs.writeFile(votesPath, JSON.stringify(votes, null, 2), 'utf8')
})

api.get('/article/:issue/:section/:week/:article', async ctx => {
  const { issue, section, week, article } = ctx.params
  ctx.body = await getWeekArticle(issue, section, week, article)
})

api.get('/article/:issue/:section/:article', async ctx => {
  const { issue, section, article } = ctx.params
  logger.debug('getArticles >> ctx.params:', ctx.params)
  ctx.body = await getArticle(issue, section, article)
})

api.get('/limiting-articles/:issue/:week/:persons', async ctx => {
  const { issue, week, persons } = ctx.params
  const articles = await persons.split(',')
    .map(async person => await getLimitingArticle(issue, week, person))
  ctx.body = await Promise.all(articles)
})

api.get('/letter/:issue', async ctx => {
  ctx.body = await getLetter(ctx.params.issue)
})

async function getLetter(issue) {
  const filePath = path.join(config.assetsRoot,
    'issues', issue, 'letter-from-the-editor.md')
  if (cache.has(filePath)) return cache.get(filePath)
  const body = await fs.readFile(filePath, 'utf8')
  return marked(body)
}

async function getLimitingArticle(issue, week, person) {
  const filePath = path.join(
    config.assetsRoot, 'issues', issue, 'limiting', week,
    person, 'text.html')
  if (cache.has(filePath)) return cache.get(filePath)
  const body = await fs.readFile(filePath, 'utf8')
  return cache.set(filePath, /*marked(body)*/body)
}

async function getWeekArticle(issue, section, week, article) {
  const filePath = path.join(
    config.assetsRoot, 'issues', issue, section, week, article)
  if (cache.has(filePath)) return cache.get(filePath)
  const body = await fs.readFile(filePath, 'utf8')
  return cache.set(filePath, /*marked(body)*/body)
}

async function getArticle(issue, section, article) {
  const filePath = path.join(
    config.assetsRoot, 'issues', issue, section, `${article}.html`)
  if (cache.has(filePath)) return cache.get(filePath)
  const body = await fs.readFile(filePath, 'utf8')
  return cache.set(filePath, /*marked(body)*/body)
}

async function getIssues(noCache = false) {
  if (cache.has('issues')) return cache.get('issues')
  const files = await fs.readdir(config.dataRoot)
  const issueCalls = await files.filter(file => file.includes('TEST'))
    .map(async file => {
      const filePath = path.resolve(config.dataRoot, file)
      const issue = await fs.readFile(filePath, 'utf8')
      return JSON.parse(issue)
    })
  const issues = await Promise.all(issueCalls)
  return cache.set('issues', issues)
}

async function getFpfys() {
  if (cache.has('fpfys')) return cache.get('fpfys')
  const fpfys = await fs.readFile(`${config.dataRoot}/fpfys.json`, 'utf8')
  return cache.set('fpfys', JSON.parse(fpfys))
}

export { getIssues, getFpfys }
export default api
