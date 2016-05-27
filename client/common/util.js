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

/**
 * @param  {Object} nativeEvent [description]
 * @param  {Function} onLoad    function called with load event and file object
 */
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

/**
 * Convert object to JSON and back to object so
 * we can debug the actual state at the time of logging
 * instead of the reference.
 *
 * IMPORTANT: This function is a noop in production.
 *
 * @param  {Any} obj
 */
export function inspect(obj) {
  if (process.env.NODE_ENV === 'development') {
    const circularJSON = require('circular-json')
    return circularJSON.parse(circularJSON.stringify(obj, null, 2))
  }
}

/**
 * Immutable splice of one index
 *
 * @param  {Array} arr
 * @param  {Number} index the index to remove
 * @return {Array}  copy of `arr` with `index` removed
 */
export function removeIndex(arr, index) {
  return arr.slice(0, index).concat(arr.slice(index+1))
}

/**
 * Immutable splice
 *
 * @param  {Array} arr
 * @param  {Number} value the value to remove
 * @return {Array}  copy of `arr` with `value` removed
 */
export function removeIndexOf(arr, value) {
  return removeIndex(arr, arr.indexOf(value))
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
