export function getRandomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomBoolean() {
  return !!getRandomInt(0, 1)
}

export function assign(...args) {
  return Object.assign({}, ...args)
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function loadFile(event, onLoad) {
  const { files } = event.target

  if (files && files[0]) {
    const file = files[0]
    const reader = new FileReader()
    reader.onload = e => {
      onLoad(file.name, reader.result)
    }
    reader.readAsBinaryString(file)
  }
}

export function inspect(obj) {
  if (process.env.NODE_ENV === 'development') {
    const circularJSON = require('circular-json')
    return circularJSON.parse(circularJSON.stringify(obj, null, 2))
  }
}

export function removeIndex(arr, index) {
  return arr.slice(0, index).concat(arr.slice(index+1))
}

export function removeIndexOf(arr, value) {
  return removeIndex(arr, arr.indexOf(value))
}

export function getSeasonAbbreviation(season) {
  return season.startsWith(`S`) ? `S/S` : `F/W`
}

export function getImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const image = new Image(src)
    image.onload = function() {
      resolve(this.width, this.height)
    }
    image.src = src
  })
}

export function identity(x) {
  return x
}

export const ident = identity

export function pluck(prop) {
  return obj => obj[prop]
}

export function dashToTitle(slug) {
  return slug.split(`-`).map(capitalize).join(` `)
}
