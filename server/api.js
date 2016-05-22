import fs from 'mz/fs'
import path from 'path'
import Router from 'koa-router'
import marked from 'marked'

import config from '../config'
import cache from './cache'

const api = new Router({ prefix: '/api' })

const renderer = new marked.Renderer()
renderer.heading = function(text, level) {
  return `<h${level}>${text}</h${level}>\n`
}
marked.setOptions({ renderer })

// ADMIN

api.post('/admin/replace-article', async ctx => {
  const { issue, section, entry, article } = ctx.request.body
  console.log(issue, section, entry, article)

  let filePath

  if (section === 'considering') {
    filePath = [
      config.assetsRoot,
      'issues',
      issue,
      section,
      `${entry}.html`
    ].join('/')

  } else if (/(limit|see|shopp|tour)ing/.test(section)) {
    filePath = [
      config.assetsRoot,
      'issues',
      issue,
      section,
      `${entry}/text.html`
    ].join('/')
  }

  try {
    await fs.writeFile(filePath, article, 'utf8')
  } catch (err) {
    const ts = Date.now()
    err.timestamp = ts
    console.error(`[${ts}] error caught in /api/admin/replace-article >> err:`,
      err)
    ctx.status = 500
    ctx.body = err

    return
  }

  if (filePath && cache.has(filePath)) {
    console.log(`removing ${filePath} from cache...`)
    cache.delete(filePath)
  }

  ctx.status = 200
})


// PUBLIC

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
  console.log('getArticles >> ctx.params:', ctx.params)
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
