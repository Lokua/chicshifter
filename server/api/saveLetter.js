import fs from 'mz/fs'
import config from '../../config'

export default async function saveLetter(ctx) {
  const { issue, text } = ctx.request.body
  await fs.writeFile(
    `${config.assetsRoot}/issues/${issue}/letter-from-the-editor.html`,
    text,
    'utf8'
  )
  ctx.status = 200
  ctx.body = text
}
