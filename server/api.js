import fs from 'mz/fs'
import path from 'path'
import Router from 'koa-router'
import marked from 'marked'

import config from '../config'
import cache from './cache'

const api = new Router({ prefix: '/api' })

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
  ctx.body = await getArticle(issue, section, article)
})

api.get('/limiting-articles/:issue/:week/:fileNames', async ctx => {
  const { issue, week, fileNames } = ctx.params
  const articles = await fileNames.split(',')
    .map(async fileName => await getLimitingArticle(issue, week, fileName))
  ctx.body = await Promise.all(articles)
})

async function getLimitingArticle(issue, week, fileName) {
  const filePath = path.join(
    config.assetsRoot, 'issues', issue, 'limiting-chic', week, fileName)
  const body = await fs.readFile(filePath, 'utf8')
  return marked(body)
}

async function getWeekArticle(issue, section, week, article) {
  const filePath = path.join(
    config.assetsRoot, 'issues', issue, section, week, article)
  const body = await fs.readFile(filePath, 'utf8')
  return marked(body)
}

async function getArticle(issue, section, article) {
  const filePath = path.join(
    config.assetsRoot, 'issues', issue, section, `${article}.md`)
  const body = await fs.readFile(filePath, 'utf8')
  return marked(body)
}

async function getIssues() {
  if (cache.has('issues')) return cache.get('issues')
  const files = await fs.readdir(config.dataRoot)
  const issueCalls = await files.filter(file => file.includes('issue'))
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