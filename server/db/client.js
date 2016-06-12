import Airtable from 'airtable'

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
})

export function createClient(baseKey) {
  const base = Airtable.base(baseKey)

  return {

    select(baseName) {
      return new Promise((resolve, reject) => {
        base(baseName).select({}).firstPage((err, records) => {
          if (err) {
            reject(err)
          } else {
            resolve(records)
          }
        })
      })
    },

    mapRecords(records) {
      return records.map(record => record._rawJson)
    }
  }
}
