import path from 'path'

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

function normalize(str) {
  return str.toLowerCase()
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
}
