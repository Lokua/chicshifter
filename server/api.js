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

api.post('/admin/replace-image', async ctx => {
  const { issue, section, entry, fileName, data } = ctx.request.body
  logger.debug({ issue, section, entry, fileName, dataLength: data.length })

  const issues = await getIssues()

  // TODO: impl...

  ctx.status = 200
  ctx.body = issues
})

api.post('/admin/replace-article', async ctx => {
  const { issue, section, entry, article } = ctx.request.body
  console.log(issue, section, entry, article)

  let filePath

  // note that `street` has no article
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

// yes this method is awful, due to bad schema design
api.post('/admin/new', async ctx => {
  const { body } = ctx.request
  const { issue, section, entry, object } = body

  const objectName = section === 'limiting'
    ? object.week
    : object.title.toLowerCase().replace(/[^a-z0-9_-]/ig, '')

  delete object.week

  const issues = await getIssues()

  logger.debug('objectName:', objectName)
  logger.debug('issue: %o, section: %o, entry: %o', issue, section, entry)

  // this is completely new entry
  if (entry === null) {
    const sectionPath = [
      config.assetsRoot,
      'issues',
      issue,
      section
    ].join('/')

    const entryPath = `${sectionPath}/${objectName}`

    // considering does not have subfolders
    if (section !== 'considering') {
      try {
        await fs.mkdir(entryPath)
      } catch (err) {
        if (err.code !== 'EEXIST') throw err
      }
    }

    // TODO: process image
    // write section thumb image
    const imagePath = `${sectionPath}/${object.image.src}`
    await fs.writeFile(imagePath, object.image.data, 'binary')

    let content

    // limiting entry has a different content schema
    if (section === 'limiting') {
      content = {
        // ana: { objectName: 'ana', images: [], ... }
      }

    } else if (section === 'considering') {
      // no content section

    } else if (section === 'street') {
      content = [/* array of { person, image, answer, age } */]

    } else {
      content = {
        images: [],
        textUrl: 'text.html'
      }
    }

    const newEntry = {
      objectName,
      title: object.title,
      image: {
        title: object.image.title,
        src: object.image.src
      },
      content
    }

    if (section === 'considering') {
      delete newEntry.content
      newEntry.textUrl = `${objectName}.html`

    } else if (section === 'street') {
      newEntry.question = object.question
    }

    issues[issue-1].sections[`${section}Chic`].content.push(newEntry)

    cache.delete('issues')

    await fs.writeFile(
      `${config.dataRoot}/issue${issue}.TEST.json`,
      JSON.stringify(issues[issue-1], null, 2),
      'utf8'
    )

    if (!/limiting|street/.test(section)) {
      let filePath

      if (section === 'considering') {
        filePath = `${sectionPath}/${newEntry.textUrl}`

      } else {
        filePath = `${entryPath}/text.html`
      }

      await fs.writeFile(
        filePath,
        '<h2><em>Article coming soon...</em></h2>',
        'utf8'
      )
    }
  }


  ctx.status = 200
  ctx.body = issues
})

api.post('/admin/delete', async ctx => {
  const { issue, section, entry } = ctx.request.body

  logger.debug('delete >> issue: %o, section: %o, entry: %o',
    issue, section, entry)

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
    // (considering does not have subfolders)
    if (section !== 'considering') {
      await rimraf(`${sectionPath}/${entryObject.objectName}`)
    } else {
      fs.unlink(`${sectionPath}/${entryObject.objectName}.html`)
    }
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
