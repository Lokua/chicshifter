import fs from 'mz/fs'

import config from '../../config'
import cache from '../cache'
import Logger from '../Logger'
const logger = new Logger('api/admin/replaceArticle', { nameColor: 'cyan' })

export default async function replaceArticle(ctx) {
  const { issue, section, entry, article } = ctx.request.body
  console.log(issue, section, entry, article)

  let filePath = [
    config.assetsRoot,
    'issues',
    issue,
    section
  ].join('/')

  // note that `street` has no article
  if (section === 'considering') {
    filePath += `/${entry}.html`

  } else if (/(limit|see|shopp|tour)ing/.test(section)) {
    filePath += `/${entry}/text.html`
  }

  try {
    await fs.writeFile(filePath, article, 'utf8')
  } catch (err) {
    const ts = Date.now()
    err.timestamp = ts
    logger.error(`[${ts}] error caught in /api/admin/replace-article >> err:`,
      err)
    ctx.status = 500
    ctx.body = err

    return
  }

  if (filePath && cache.has(filePath)) {
    logger.debug(`removing ${filePath} from cache...`)
    cache.delete(filePath)
  }

  ctx.status = 200
}
