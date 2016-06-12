const fs = require('mz/fs')
const Airtable = require('airtable')

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
})

const issue = { limiting: {} }

// limiting
const base = Airtable.base('appw9CnfNfbL8qTtS')

select('Issue1:Meta')
  .then(mapJson)
  .then(meta => issue.limiting.meta = meta)
  .then(() => select('Issue1').then(mapJson))
  .then(posts => issue.limiting.posts = posts)
  .then(() => {
    // console.log('issue:', issue)
    return fs.writeFile(
      `${__dirname}/limiting.json`,
      JSON.stringify(issue, null, 2),
      'utf8'
    )
  })
  .then(() => console.log('Done'))

function select(baseName) {
  return new Promise((resolve, reject) => {
    base(baseName).select({}).firstPage((err, records) => {
      if (err) {
        reject(err)
      } else {
        resolve(records)
      }
    })
  })
}

function mapJson(records) {
  return records.map(record => record._rawJson)
}
