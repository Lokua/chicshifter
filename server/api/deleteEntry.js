import fs from 'mz/fs'
import rimraf from 'rimraf-promise'
import find from 'lodash.find'

import config from '../../config'
import cache from '../cache'
import Logger from '../Logger'
import { getIssues } from './api'
const logger = new Logger('api/admin/deleteEntry', { nameColor: 'cyan' })

export default async function deleteEntry(ctx) {
  const { issue, section, entry } = ctx.request.body

  logger.debug('delete >> issue: %o, section: %o, entry: %o',
    issue, section, entry)

  const issues = await getIssues()
  const content = issues[issue-1].sections[`${section}Chic`].content
  const entryObject = find(content, { objectName: entry })

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
      await fs.unlink(`${sectionPath}/${entryObject.objectName}.html`)
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

    const exists = await fs.exists(imagePath)
    if (exists) await fs.unlink(imagePath)
  }

  await fs.writeFile(
    `${config.dataRoot}/issue${issue}.json`,
    JSON.stringify(issues[issue-1], null, 2),
    'utf8'
  )

  ctx.body = await getIssues()
}
