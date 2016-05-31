/* eslint-disable no-unused-vars */
import fs from 'mz/fs'
import find from 'lodash.find'
import config from '../../config'
import cache from '../cache'
import Logger from '../Logger'
import * as util from '../util'
import { getFpfys } from './api'

const logger = new Logger('admin/fpfys', { nameColor: 'cyan' })

export async function update(ctx) {
  const { data } = ctx.request.body
  logger.debug(data)
  const fpfys = cache.get('fpfys') || await getFpfys()
  let fpfy = find(fpfys, { id: data.id })
  const index = fpfys.indexOf(fpfy)
  fpfy = Object.assign({}, fpfy, data)
  fpfys[index] = fpfy
  await writeFpfys(fpfys)
  ctx.body = cache.set('fpfys', fpfys)
}

export async function del(ctx) {
  const { data } = ctx.request.body
  const fpfys = cache.get('fpfys') || await getFpfys()
  const index = fpfys.indexOf(data)
  fpfys.splice(index, 1)
  if (data.image && data.image.src) {
    fs.unlink(`${config.assetsRoot}/images/fpfys/${data.image.src}`)
  }
  await writeFpfys(fpfys)
  ctx.body = cache.set('fpfys', fpfys)
}

export async function add(ctx) {
  const fpfys = cache.get('fpfys') || await getFpfys()
  fpfys.push({
    id: getLastId(fpfys),
    name: null,
    image: null,
    response: {
      type: 'Faux Yeah',
      text: null
    }
  })
  await writeFpfys(fpfys)
  ctx.body = cache.set('fpfys', fpfys)
}

export async function replaceImage(ctx) {
  // data === { fpfy, fileName, data }
  const { data } = ctx.request.body
  const fpfys = cache.get('fpfys') || await getFpfys()
  const fpfy = find(fpfys, { id: data.fpfy.id })
  if (fpfy.image && fpfy.image.src) {
    fs.unlink(`${config.assetsRoot}/images/fpfys/${fpfy.image.src}`)
  }
  fpfy.image = {
    src: util.normalizeImageSrc(data.fileName)
  }
  await fs.writeFile(
    `${config.assetsRoot}/images/fpfys/${fpfy.image.src}`,
    data.data,
    'binary'
  )
  const index = fpfys.indexOf(fpfy)
  fpfys[index] = fpfy
  await writeFpfys(fpfys)
  ctx.body = cache.set('fpfys', fpfys)
}

//    +---------+
//    | HELPERS |
//    +---------+


function getLastId(fpfys) {
  const ids = fpfys.map(fpfy => fpfy.id).sort()
  return String(parseInt(ids[ids.length-1], 10) + 1)
}

async function writeFpfys(fpfys) {
  return await fs.writeFile(
    `${config.dataRoot}/fpfys.TEST.json`,
    JSON.stringify(fpfys, null, 2),
    'utf8'
  )
}
