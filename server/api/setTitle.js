import find from 'lodash.find'
import * as util from '../util'
import cache from '../cache'
import { getIssues } from './api'
import Logger from '../Logger'

const logger = new Logger('/api/admin/set-title', { nameColor: 'cyan' })

export default async function setTitle(ctx) {
  const { issue, section, entry, title } = ctx.request.body
  logger.debug({ issue, section, entry, title })

  if (!/(see|shopp|tour)ing/.test(section)) {
    logger.error('setTitle has no impl for', section)
    return ctx.status = 200
  }

  const issues = cache.get('issues') || await getIssues()
  const issueObject = issues[issue-1]
  const item = find(issueObject.sections[`${section}Chic`].content, {
    objectName: entry
  })

  item.title = title
  // item.objectName = util.titleToObjectName(title)

  util.writeIssue(issueObject)
  ctx.body = cache.set('issues', issues)
}
