import { createClient } from './client'
import cache from '../cache'
import config from '../../config'
import later from 'later'
import Logger from '../Logger'

const logger = new Logger('db')

const db = createClient(config.airtable.base)
let sheduled = false

export default async function populateIssues() {

  if (cache.has('issuesV2')) {
    logger.debug('returning v2 issues from cache...')

    return cache.get('issuesV2')
  }

  cache.set('issuesV2', await populate())

  if (!sheduled) {
    sheduled = true
    const schedule = later.parse.recur().every(2).minute()
    later.setInterval(async () => {
      logger.info('schedule >> Resetting v2 cache')
      cache.set('issuesV2', await populate())
    }, schedule)
  }

  return cache.get('issuesV2')
}

async function selectTable(table) {
  return await db.select(table)
    .then(db.mapRecords)
    .then(records => {
      logger.info(`Done mapping ${table}`)

      return records
    })
}

async function populate() {
  const start = new Date()

  const fpfys = await selectTable('FPFY')
  const about = await selectTable('AboutCredits')
  const issues = await selectTable('Issues')
  const sections = await selectTable('Sections')
  const considering = await selectTable('ConsideringData')
  const limitingMeta = await selectTable('LimitingMeta')
  const limiting = await selectTable('LimitingData')
  const seeing = await selectTable('SeeingData')
  const shopping = await selectTable('ShoppingData')
  const streetMeta = await selectTable('StreetMeta')
  const street = await selectTable('StreetData')
  const touring = await selectTable('TouringData')

  logger.info(`airtable query finished in ${new Date() - start}ms`)

  return {
    fpfys,
    issues,
    about,
    sections,
    considering: { data: considering },
    limiting: {
      meta: limitingMeta,
      data: limiting
    },
    seeing: { data: seeing },
    shopping: { data: shopping },
    street: {
      meta: streetMeta,
      data: street
    },
    touring: { data: touring }
  }
}
