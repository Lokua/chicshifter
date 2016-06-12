import fs from 'mz/fs'
import config from '../../config'
import { createClient } from './client'

const db = createClient(config.airtable.base.considering)

export default async function considering() {
  const considering = {}

  return await db.select('Issue1:Meta')
    .then(db.mapRecords)
    .then(meta => considering.meta = meta)
    .then(() => db.select('Issue1').then(db.mapRecords))
    .then(posts => considering.posts = posts)
    .then(() => {
      return fs.writeFile(
        `${__dirname}/considering.json`,
        JSON.stringify(considering, null, 2),
        'utf8'
      )
    })
    .then(() => {
      console.log('Done')
      return considering
    })
}
