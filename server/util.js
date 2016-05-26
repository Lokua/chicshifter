import path from 'path'
import fs from 'mz/fs'

import config from '../config'

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

export async function writeIssue(issue, issueNumber) {
  return await fs.writeFile(
    `${config.dataRoot}/issue${issueNumber}.TEST.json`,
    JSON.stringify(issue, null, 2),
    'utf8'
  )
}

function normalize(str) {
  return str.toLowerCase()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
}
