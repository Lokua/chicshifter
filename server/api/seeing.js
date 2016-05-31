import fs from 'mz/fs'
import find from 'lodash.find'

import * as util from '../util'
import cache from '../cache'
import { getIssues } from './api'
import Logger from '../Logger'

const logger = new Logger('seeing', { nameColor: 'cyan' })

export async function addGalleryImage(ctx) {
  const { issue, section, entry } = ctx.request.body
  logger.debug({ issue, section, entry })

  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]

  find(issueObject.sections[`${section}Chic`].content, {
    objectName: entry
  }).content.images.push({
    src: null,
    title: null,
    credits: null
  })

  util.writeIssue(issueObject)
  ctx.body = cache.set('issues', issues)
}

export async function deleteGalleryImage(ctx) {
  const { issue, section, entry, index } = ctx.request.body
  logger.debug({ issue, section, entry, index })

  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]

  find(issueObject.sections[`${section}Chic`].content, {
    objectName: entry
  }).content.images.splice(index, 1)

  util.writeIssue(issueObject)
  ctx.body = cache.set('issues', issues)
}

export async function setGalleryImageRotation(ctx) {
  const { issue, section, entry, index, rotate } = ctx.request.body
  logger.debug({ issue, section, entry, index, rotate })

  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]

  find(issueObject.sections[`${section}Chic`].content, {
    objectName: entry
  }).content.images[index].rotate = rotate

  util.writeIssue(issueObject)
  ctx.body = cache.set('issues', issues)
}

export async function replaceGalleryImage(ctx) {
  const { issue, section, entry, index, fileName, data } = ctx.request.body
  logger.debug({ issue, section, entry, index, fileName, dataLen: data.length })

  const title = util.fileNameToTitle(fileName)
  const src = util.normalizeImageSrc(fileName)

  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]
  const image = find(issueObject.sections[`${section}Chic`].content, {
    objectName: entry
  }).content.images[index]

  const sectionPath = util.getSectionPath(issue, section)

  if (image.src) {
    fs.unlink(`${sectionPath}/${entry}/${image.src}`)
  }

  image.title = title
  image.src = src

  await fs.writeFile(`${sectionPath}/${entry}/${image.src}`, data, 'binary')

  util.writeIssue(issueObject)
  ctx.body = cache.set('issues', issues)
}

export async function addCredit(ctx) {
  const { issue, section, entry, index } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]
  const image = find(issueObject.sections[`${section}Chic`].content, {
    objectName: entry
  }).content.images[index]
  const credit = {
    type: null,
    author: { name: null }
  }
  if (image.credits) {
    image.credits.push(credit)
  } else {
    image.credits = [credit]
  }
  util.writeIssue(issueObject)
  ctx.body = cache.set('issues', issues)
}

export async function deleteCredit(ctx) {
  const { issue, section, entry, index, credit } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]
  const image = find(issueObject.sections[`${section}Chic`].content, {
    objectName: entry
  }).content.images[index]
  image.credits.splice(credit, 1)
  util.writeIssue(issueObject)
  ctx.body = cache.set('issues', issues)
}

export async function updateCredit(ctx) {
  const { issue, section, entry, index, credit, data } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]
  const creditObject = find(issueObject.sections[`${section}Chic`].content, {
    objectName: entry
  }).content.images[index].credits[credit]
  creditObject.type = data.type
  creditObject.author = { name: data.name }
  util.writeIssue(issueObject)
  ctx.body = cache.set('issues', issues)
}
