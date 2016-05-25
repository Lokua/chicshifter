import fs from 'mz/fs'

import config from '../../config'
import cache from '../cache'
import Logger from '../Logger'
import * as util from '../util'
import { getIssues } from './api'

const logger = new Logger('api/admin/createEntry', { nameColor: 'cyan' })

/**
 * Adds a new entry to an issue's section's content portion
 */
export default async function createEntry(ctx) {

  const { body } = ctx.request
  const { issue, section, entry, object } = body

  const objectName = section === 'limiting'
    ? object.week
    : util.titleToObjectName(object.title)
    // : object.title.toLowerCase().replace(/[^a-z0-9_-]/ig, '')

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
}
