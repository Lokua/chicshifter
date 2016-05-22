import fs from 'mz/fs'
import path from 'path'
import Router from 'koa-router'
import marked from 'marked'
import find from 'lodash.find'
import rimraf from 'rimraf-promise'

import config from '../config'
import cache from './cache'
import Logger from './Logger'

const logger = new Logger('api')

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

api.post('/admin/new', async ctx => {
  const { body } = ctx.request
  const { issue, section, entry, object } = body
  const objectName = object.title.toLowerCase().replace(/[^a-z0-9_-]/ig, '')
  const { src, title }  = object.image

  const issues = await getIssues()

  logger.debug('objectName:', objectName)
  logger.debug(issue, section, entry, object.title, src, title)

  // this is completely new entry
  if (entry === null) {

    if (section === 'seeing') {
      const sectionPath = [
        config.assetsRoot,
        'issues',
        issue,
        section
      ].join('/')

      const entryPath = `${sectionPath}/${objectName}`

      try {
        await fs.mkdir(entryPath)
      } catch (err) {
        if (err.code !== 'EEXIST') throw err
      }

      if (object.image.src && object.image.data) {

        // TODO: process image
        // write section thumb image
        const imagePath = `${sectionPath}/${object.image.src}`
        await fs.writeFile(imagePath, object.image.data, 'binary')

        const newEntry = {
          objectName,
          title: object.title,
          image: {
            title: object.image.title,
            src: object.image.src
          },
          content: {
            images: [],
            textUrl: 'text.html'
          }
        }

        issues[issue-1].sections[`${section}Chic`].content.push(newEntry)

        cache.delete('issues')

        await fs.writeFile(
          `${config.dataRoot}/issue${issue}.TEST.json`,
          JSON.stringify(issues[issue-1], null, 2),
          'utf8'
        )

        await fs.writeFile(
          `${entryPath}/text.html`,
          '<!-- Hello! -->',
          'utf8'
        )
      }
    }
  }


  ctx.status = 200
  ctx.body = issues
})

api.post('/admin/delete', async ctx => {
  const { issue, section, entry } = ctx.request.body

  if (section !== 'seeing') {
    logger.warn('delete is not impl for', section)
    return ctx.body = await getIssues()
  }


  const issues = await getIssues()
  const content = issues[issue-1].sections[`${section}Chic`].content
  const entryObject = find(content, {
    objectName: entry
  })

  logger.debug('entryObject:', entryObject)

  const index = content.indexOf(entryObject)
  content.splice(index, 1)
  issues[issue-1].sections[`${section}Chic`].content = content

  cache.delete('issues')

  const sectionPath = [
    config.assetsRoot,
    'issues',
    issue,
    section
  ].join('/')

  try {
    // remove entry folder
    await rimraf(`${sectionPath}/${entryObject.objectName}`)
  } catch (err) {
    if (err) {
      logger.warn('/api/admin/delete >> rethrowing caught error...')
      throw err
    }
  }

  // remove section toc entry thumb
  if (entryObject.image && entryObject.image.src) {
    const imagePath = `${sectionPath}/${entryObject.image.src}`

    if (await fs.exists(imagePath)) {
      await fs.unlink(imagePath)
    }
  }

  await fs.writeFile(
    `${config.dataRoot}/issue${issue}.TEST.json`,
    JSON.stringify(issues[issue-1], null, 2),
    'utf8'
  )

  ctx.body = await getIssues()
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
