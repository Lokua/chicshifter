import path from 'path'
import fs from 'mz/fs'
import jws from 'jws'
import moment from 'moment'
import config from '../config'
import Logger from './Logger'

const logger = new Logger('util', { nameColor: 'magenta' })

export function createToken() {
  const now = moment()

  return jws.sign({
    header: {
      typ: 'JWT',
      alg: process.env.CHIC_JWT_ALG
    },
    payload: {
      iss: 'Lokua',
      sub: 'master',
      aud: 'admin',
      exp: now.add(1, 'M').unix(),
      jti: now.toISOString(),
      iat: moment().unix(),
      nbf: now.unix()
    },
    secret: process.env.CHIC_JWT_SECRET,
    encoding: 'utf8'
  })
}

/**
 * Verify and get payload from JWT
 *
 * @param  {Object} JWT payload if token is valid
 * @return {Boolean} true if token is valid
 */
export function verifyToken(token) {
  if (!token) {
    logger.error('verifyToken >> token is undefined.')
    return false
  }

  try {
    const valid = jws.verify(
      token,
      process.env.CHIC_JWT_ALG,
      process.env.CHIC_JWT_SECRET
    )

    if (valid) {
      return jws.decode(token)
    }

  } catch (err) {
    logger.error('Error caught in verifyToken >> err:', err)
    return false
  }
}

export function randomString(length) {
  return Math.round(
    (Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
  ).toString(36).slice(1)
}

export function normalizeImageSrc(src) {

  // remove extension before normalization then add it back, otherwise
  // we'll get, for example, `filenamejpg`
  const ext = path.extname(src)
  src = src.replace(ext, '')

  return normalize(src) + ext
}

export function fileNameToTitle(str) {
  return normalize(str.replace(path.extname(str), ''))
}

export function titleToObjectName(str) {
  return normalize(str)
}

export function getIssuePath(issue) {
  return `${config.assetsRoot}/issues/${issue}`
}

export function getSectionPath(issue, section) {
  return `${getIssuePath(issue)}/${section}`
}

export async function writeIssue(issue) {
  if (arguments.length === 2) {
    console.warn('writeIssue no longer needs a 2nd issueNumber arg')
  }

  return await fs.writeFile(
    `${config.dataRoot}/issue${issue.id}.TEST.json`,
    JSON.stringify(issue, null, 2),
    'utf8'
  )
}

function normalize(str) {
  return str.toLowerCase()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
}
