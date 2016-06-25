import { createClient } from './client'
import cache from '../cache'
import config from '../../config'

const db = createClient(config.airtable.base)

export default async function populateIssues() {

  if (cache.has('issuesV2')) {
    console.log('returning v2 issues from cache...')
    return cache.get('issuesV2')
  }

  const fpfys = await selectTable('FPFY')
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

  return cache.set('issuesV2', {
    fpfys,
    issues,
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
  })
}

async function selectTable(table) {
  return await db.select(table)
    .then(db.mapRecords)
}
