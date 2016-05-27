import fs from 'mz/fs'
import find from 'lodash.find'
import rimraf from 'rimraf-promise'

import Logger from '../Logger'
import { getIssues } from './api'
import cache from '../cache'
import * as util from '../util'

const logger = new Logger('/api/admin/limiting', { nameColor: 'cyan' })

export async function setWeek(ctx) {
  const { issue, oldWeek, newWeek } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const weekObject = getWeekById(issues[issue-1], oldWeek)
  const index = getWeekIndex(issues[issue-1], weekObject)
  issues[issue-1].sections.limitingChic.content[index] =
    Object.assign({}, weekObject, { objectName: newWeek })
  const sectionPath = util.getSectionPath(issue, 'limiting')
  // write json and rename entry folder to match week
  await Promise.all([
    util.writeIssue(issues[issue-1], issue),
    fs.rename(`${sectionPath}/${oldWeek}`, `${sectionPath}/${newWeek}`)
  ])
  ctx.body = issues
}

export async function setTitle(ctx) {
  const { issue, week, title } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const weekObject = getWeekById(issues[issue-1], String(week))
  const index = getWeekIndex(issues[issue-1], weekObject)
  issues[issue-1].sections.limitingChic.content[index] =
    Object.assign({}, weekObject, { title })
  util.writeIssue(issues[issue-1], issue)
  ctx.body = issues
}

export async function newEntry(ctx) {
  const { issue, section, week } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const weekObject = getWeekById(issues[issue-1], week)
  const index = getWeekIndex(issues[issue-1], weekObject)
  const author = generateRandomAuthorName()
  issues[issue-1].sections[`${section}Chic`].content[index].content[author] = {
    objectName: author,
    textUrl: '',
    images: []
  }
  const sectionPath = util.getSectionPath(issue, 'limiting')
  const entryPath = `${sectionPath}/${week}/${author}`
  await fs.mkdir(entryPath)
  await fs.writeFile(
    `${entryPath}/text.html`,
    '<h2><em>Article coming soon...</em></h2>',
    'utf8'
  )
  await util.writeIssue(issues[issue-1], issue)
  ctx.body = issues
}

export async function deleteEntry(ctx) {
  const { issue, week, author } = ctx.request.body
  logger.debug(issue, week, author)
  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]
  const weekObject = getWeekById(issueObject, String(week))
  const index = getWeekIndex(issueObject, weekObject)
  delete issueObject.sections.limitingChic.content[index].content[author]
  await rimraf(`${util.getSectionPath(issue, 'limiting')}/${week}/${author}`)
  await util.writeIssue(issueObject, issue)
  ctx.body = issues
}

export async function saveAuthor(ctx) {
  const { issue, week, oldAuthor, newAuthor } = ctx.request.body
  const author = newAuthor.toLowerCase()
  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]
  const weekObject = getWeekById(issueObject, week)
  weekObject.content[author] = Object.assign({},
    weekObject.content[oldAuthor],
    { objectName: author }
  )
  delete weekObject.content[oldAuthor]
  await util.writeIssue(issueObject, issue)
  const sectionPath = util.getSectionPath(issue, 'limiting')
  await fs.rename(
    `${sectionPath}/${week}/${oldAuthor}`,
    `${sectionPath}/${week}/${author}`
  )
  ctx.body = issues
}

export async function newImage(ctx) {
  const { issue, week, author } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const weekObject = getWeekById(issues[issue-1], week)
  weekObject.content[author].images.push({
    title: null,
    src: null,
    author: null
  })
  ctx.body = issues
}

/**
 * # Post Data:
 * + issue
 * + week
 * + author
 * + index
 * + image
 * + data
 */
export async function replaceEntryImage(ctx) {
  const { issue, week, author, index, fileName, data } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const weekObject = getWeekById(issues[issue-1], week)
  const origImage = Object.assign({},
    weekObject.content[author].images[index])

  const title = util.fileNameToTitle(fileName)
  const src = util.normalizeImageSrc(fileName)

  weekObject.content[author].images[index] = {
    title,
    src,
    author: null
  }

  const sectionPath = util.getSectionPath(issue, 'limiting')
  const authorPath = `${sectionPath}/${week}/${author}`
  if (origImage.src) {
    await fs.unlink(`${authorPath}/${origImage.src}`)
  }
  await fs.writeFile(`${authorPath}/${src}`, data, 'binary')
  await util.writeIssue(issues[issue-1], issue)
  ctx.body = issues
}

export async function setEntryImageRotation(ctx) {
  const { issue, week, author, index, value } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const weekObject = getWeekById(issues[issue-1], week)
  weekObject.content[author].images[index].rotate = value
  await util.writeIssue(issues[issue-1], issue)
  ctx.body = issues
}

export async function deleteEntryImage(ctx) {
  const { issue, week, author, index } = ctx.request.body
  const issues = cache.get('issues') || await getIssues()
  const weekObject = getWeekById(issues[issue-1], week)
  const removed = weekObject.content[author].images.splice(index, 1)[0]
  const sectionPath = util.getSectionPath(issue, 'limiting')
  await fs.unlink(`${sectionPath}/${week}/${author}/${removed.src}`)
  await util.writeIssue(issues[issue-1], issue)
  ctx.body = issues
}

//    +---------+
//    | HELPERS |
//    +---------+

function getWeekById(issue, week) {
  return find(issue.sections.limitingChic.content, { objectName: week })
}

function getWeekIndex(issue, weekObject) {
  return issue.sections.limitingChic.content.indexOf(weekObject)
}

function generateRandomAuthorName() {
  return Math.random().toString(36).slice(5, 13)
}
