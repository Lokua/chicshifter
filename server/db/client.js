import Airtable from 'airtable'
import Logger from '../Logger'

const logger = new Logger(`db/client`)

Airtable.configure({
  endpointUrl: `https://api.airtable.com`,
  apiKey: process.env.AIRTABLE_API_KEY
})

export default function createClient(baseKey) {
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

        if (r.fields.Credits) {
          try {
            const credits = parseCsv(r.fields.Credits)

            if (Array.isArray(r.fields.Images)) {
              r.fields.Images.forEach(image => {
                image.credits = credits.filter(credit => (
                  credit.filename === image.filename
                ))
              })
            }
          } catch (err) {
            debugCsvParseError(err, r)
            delete r.fields.Credits
          }
        }

        return r
      })
    }
  }
}

function parseCsv(csv) {
  const split = csv.trim().split(`\n`)
  const keys = split.shift().split(`,`).map(str => str.trim())
  const parsed = split.map(str => {
    const record = {}
    str.split(`,`).forEach((value, i) => record[keys[i]] = value.trim())

    return record
  })

  return parsed
}

function debugCsvParseError(error, record) {
  const r = Object.keys(record.fields).reduce((obj, field) => {
    if (field !== `HTML`) {
      obj[field] = record.fields[field]
    }

    return obj
  }, {})
  logger.error(`Error parsing CSV >> record.fields (w/out HTML):`, r)
  logger.error(`Error parsing CSV >> (original error):`, error)
}
