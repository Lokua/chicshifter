import fs from 'mz/fs'
import config from '../../config'
import { createClient } from './client'

export default async function section(name) {
  const db = createClient(config.airtable.base[name])
  const data = {}

  return await db.select('Issue1:Meta')
    .then(db.mapRecords)
    .then(meta => data.meta = meta)
    .then(() => db.select('Issue1').then(db.mapRecords))
    .then(posts => data.posts = posts)
    .then(() => {
      return fs.writeFile(
        `${__dirname}/${name}.json`,
        JSON.stringify(data, null, 2),
        'utf8'
      )
    })
    .then(() => {
      console.log('Done writing', name)
      return data
    })
}
