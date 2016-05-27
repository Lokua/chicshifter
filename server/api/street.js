import fs from 'mz/fs'
import find from 'lodash.find'
// import rimraf from 'rimraf-promise'

import { getIssues } from './api'
import cache from '../cache'
import * as util from '../util'
import Logger from '../Logger'

// eslint-disable-next-line
const logger = new Logger('/api/admin/limiting', { nameColor: 'cyan' })

export async function update(ctx) {
  const { issue, entry, title, question } = ctx.request.body
  logger.debug({ issue, entry, title, question })
  const issues = cache.get('issues') || await getIssues()
  const entryObject = find(issues[issue-1].sections.streetChic.content, {
    objectName: entry
  })
  entryObject.title = title || entryObject.title
  entryObject.question = question || entryObject.question
  util.writeIssue(issues[issue-1])
  ctx.body = issues
}

export async function replaceImage(ctx) {
  const { issue, entry, fileName, data } = ctx.request.body
  logger.debug({ issue, entry, fileName, dataLength: data.length })
  const issues = cache.get('issues') || await getIssues()
  const title = util.fileNameToTitle(fileName)
  const src = util.normalizeImageSrc(fileName)
  const entryObject = find(issues[issue-1].sections.streetChic.content, {
    objectName: entry
  })
  const sectionPath = util.getSectionPath(issue, 'street')
  if (entryObject.image.src !== src) {
    fs.unlink(`${sectionPath}/${entryObject.image.src}`)
  }
  entryObject.image.title = title
  entryObject.image.src = src
  await fs.writeFile(`${sectionPath}/${src}`, data, 'binary')
  util.writeIssue(issues[issue-1])
  ctx.body = issues
}

export async function updateEntry(ctx) {
  const { issue, entry, index, person, age, answer } = ctx.request.body
  logger.debug({ issue, entry, index, person, age, answer })
  const issues = cache.get('issues') || await getIssues()
  ctx.body = issues
}

export async function replaceEntryImage(ctx) {
  const { issue, entry, index, fileName, data } = ctx.request.body
  logger.debug({ issue, entry, index, fileName, dataLength: data.length })
  const issues = cache.get('issues') || await getIssues()
  const src = util.normalizeImageSrc(fileName)
  const item = find(issues[issue-1].sections.streetChic.content, {
    objectName: entry
  }).content[index]
  const entryPath = `${util.getSectionPath(issue, 'street')}/${entry}`
  if (item.image !== src) {
    fs.unlink(`${entryPath}/${item.image}`)
  }
  item.image = src
  await fs.writeFile(`${entryPath}/${src}`, data, 'binary')
  util.writeIssue(issues[issue-1])
  ctx.body = issues
}

export async function newItem(ctx) {
  const { issue, entry } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  find(issues[issue-1].sections.streetChic.content, {
    objectName: entry
  }).content.push({
    person: null,
    image: null,
    answer: null,
    age: null
  })
  util.writeIssue(issues[issue-1])
  ctx.body = issues
}

export async function deleteItem(ctx) {
  const { issue, entry, index } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const deleted = find(issues[issue-1].sections.streetChic.content, {
    objectName: entry
  }).content.splice(index, 1)[0]
  const sectionPath = util.getSectionPath(issue, 'street')
  const imagePath = `${sectionPath}/${entry}/${deleted.image}`
  const exists = await fs.exists(imagePath)
  if (exists) await fs.unlink(imagePath)
  util.writeIssue(issues[issue-1])
  ctx.body = issues
}
