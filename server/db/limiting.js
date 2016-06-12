import fs from 'mz/fs'
import config from '../../config'
import { createClient } from './client'

const db = createClient(config.airtable.base.limiting)

export default async function limiting() {
  const limiting = {}

  return await db.select('Issue1:Meta')
    .then(db.mapRecords)
    .then(meta => limiting.meta = meta)
    .then(() => db.select('Issue1').then(db.mapRecords))
    .then(posts => limiting.posts = posts)
    .then(() => {
      return fs.writeFile(
        `${__dirname}/limiting.json`,
        JSON.stringify(limiting, null, 2),
        'utf8'
      )
    })
    .then(() => {
      console.log('Done')
      return limiting
    })
}
