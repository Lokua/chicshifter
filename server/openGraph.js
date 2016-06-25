/* eslint-disable no-unused-vars */
import url from 'url'
import path from 'path'
import find from 'lodash.find'

import Logger from './Logger'
import { capitalize } from '@common'

const logger = new Logger('openGraph', { nameColor: 'cyan' })
const base = 'https://chicshifter.com'

// Required tags:
// title, type, image, url

export function renderOpenGraphTags(ctx, state, renderProps) {
  const url = path.parse(ctx.url)
  const tags = [
    meta('site_name', 'Chic Shifter'),
    meta('url', `${base}${ctx.url}`)
  ]

  if (/issue\/\d+\/\w\/.+/.test(ctx.url)) {

    // TODO: make article meta tags
    // const parts = ctx.url.split('/')
    tags.push(meta('title', 'Chic Shifter'))
    tags.push(meta('type', 'article'))
    tags.push(meta('image', `${base}/static/images/FlamingoPattern-01.png`))

  } else if (/((consider|limit|see|shopp|tour)ing|street)$/.test(url.name)) {
    // section page

    const issue = url.dir.slice(url.dir.lastIndexOf('/')+1)
    const index = Number(issue) - 1

    const imageUrl = find(state.v2.sections, x => (
      x.fields.Slug === url.name
    )).fields.Image[0].url

    const title = `${capitalize(url.name)} Chic`
    tags.push(meta('title', title))
    tags.push(meta('type', 'article'))
    tags.push(meta('article:section', title))
    tags.push(meta('image', imageUrl))

  } else {
    // home page

    tags.push(meta('title', 'Chic Shifter'))
    tags.push(meta('type', 'website'))
    tags.push(meta('image', `${base}/static/images/FlamingoPattern-01.png`))
  }

  // logger.debug('tags:', tags)
  return tags.join('\n  ')
}

function meta(property, content) {
  return `<meta property="og:${property}" content="${content}">`
}
