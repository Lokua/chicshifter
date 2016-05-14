#!/usr/bin/env node
/* eslint-disable no-unused-vars */
const path = require('path')
const sharp = require('sharp')
const fs = require('mz/fs')

const size = 1024

// running this from `run` script; hence 3
const args = process.argv.slice(3)

const [ inputDir, outputDir ] = args.map(dir =>
  path.resolve(__dirname, '..', dir)
)

;(async () => {

  console.log('running...')

  const fileNames = await fs.readdir(inputDir)

  await fileNames.map(async fileName => {
    if (/^\._/i.test(fileName)) {
      console.log('skipping dotfile')
      return
    }

    if (!/jpg|jpeg|png|webp|gif|svg|tiff/i.test(fileName)) {
      console.log('skipping non image')
      return
    }

    console.info(`reading ${fileName}...`)

    const filePath = path.join(inputDir, fileName)
    const [name, ext] = fileName.split('.')
    const outPath = path.join(outputDir, `${name}__${size}.${ext}`)

    sharp(filePath)
      .resize(size)
      .toFile(outPath, (err, info) => {
        if (err) {
          console.info(`about to throw from processing ${fileName}`)
          throw err
        }
        console.info('info:', info)
      })
  })
})()
