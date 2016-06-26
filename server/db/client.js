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
      return records.map(record => {
        const r = record._rawJson

        if (r.fields && r.fields.Credits) {
          try {
            const credits = parseCsv(r.fields.Credits)
            r.fields.Images.forEach(image => {
              image.credits = credits.filter(credit => (
                credit.filename === image.filename
              ))
            })
          } catch (err) {
            console.error('error parsing csv >> r.id:', r.id)
            delete r.fields.Credits
          }
        }

        return r
      })
    }
  }
}

function parseCsv(csv) {
  const split = csv.trim().split('\n')
  const keys = split.shift().split(',').map(str => str.trim())
  const parsed = split.map(str => {
    const record = {}
    str.split(',').forEach((value, i) => record[keys[i]] = value.trim())

    return record
  })

  return parsed
}
