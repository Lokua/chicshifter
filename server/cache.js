class Cache {
  constructor() {
    this._store = new Map()
  }
  has(key) {
    return this._store.has(key)
  }
  get(key) {
    return this._store.get(key)
  }
  set(key, value) {
    this._store.set(key, value)
    return value
  }
  delete(key) {
    this._store.delete(key)
    return this
  }
}

const cache = new Cache()
export default cache
