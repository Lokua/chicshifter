/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 *
 * @see http://stackoverflow.com/a/1527820/2416000
 */
export function getRandomInt(
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER
  ) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomBoolean() {
  return !!getRandomInt(0, 1)
}

/**
 * Prefills empty object as first argument to `Object.assign`
 */
export function assign(...args) {
  return Object.assign({}, ...args)
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// export getImageDimensions(src) {
//   return new Promise((resolve, reject) => {
//     const image = new Image(src)
//     image.onload = function() {
//       resolve(this.width, this.height)
//     }
//     image.src = src
//   })
// }
