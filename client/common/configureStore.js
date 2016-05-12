import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './rootReducer'

const middlewares = [thunk]
const { TEST, NODE_ENV } = process.env


if (NODE_ENV === 'development' && !TEST) {
  const logger = require('redux-logger')({ collapsed: true })
  middlewares.push(logger)
}

export default function configureStore(initialState = {}) {

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  )

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
