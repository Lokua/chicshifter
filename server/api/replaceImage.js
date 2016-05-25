import fs from 'mz/fs'
import prettyBytes from 'pretty-bytes'
import find from 'lodash.find'

import config from '../../config'
import cache from '../cache'
import Logger from '../Logger'
import { getIssues } from './api'
import * as util from '../util'

const logger = new Logger('api/admin/replaceImage', { nameColor: 'cyan' })

/**
 * Replace entry (thumb) image
 */
export default async function replaceImage(ctx) {
  const { issue, section, entry, fileName, data } = ctx.request.body

  logger.info({ issue, section, entry, fileName,
    dataLength: prettyBytes(data.length) })

  const issues = cache.get('issues') || await getIssues()

  // 1. delete existing image
  // 2. replace image src with new fileName

  const sectionPath = [
    config.assetsRoot,
    'issues', issue,
    section
  ].join('/')

  const content = issues[issue-1].sections[`${section}Chic`].content

  // existing entry
  const entryObject = find(content, { objectName: entry })

  const src = util.normalizeImageSrc(fileName)

  // updated entry
  const updatedEntry = Object.assign({}, entryObject, {
    image: {
      title: util.fileNameToTitle(src),
      src
    }
  })

  try {
    // remove old image
    await fs.unlink(`${sectionPath}/${entryObject.image.src}`)

    // write new image
    await fs.writeFile(`${sectionPath}/${updatedEntry.image.src}`,
      data, 'binary')

  } catch (err) {
    logger.error('caught error:', err)
    return ctx.status = 500
  }

  // replace old entryObject with updated replacement
  const index = content.indexOf(entryObject)
  issues[issue-1].sections[`${section}Chic`].content[index] = updatedEntry

  // rewrite issue data json
  await fs.writeFile(
    `${config.dataRoot}/issue${issue}.TEST.json`,
    JSON.stringify(issues[issue-1], null, 2),
    'utf8'
  )

  // TODO: impl...

  ctx.status = 200
  ctx.body = issues
}
