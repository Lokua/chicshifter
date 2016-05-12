import 'babel-polyfill'
import './index.scss'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'

// NOTE: something from common must always be imported
// before anything in any other folder to avoid circular
// dependencies, at least until circular deps are handled
// correctly by webpack
// @see https://github.com/webpack/webpack/issues/1788
import { routes, configureStore } from './common'

const initialState = window.__INITIAL_STATE__ || {}
const store = configureStore(initialState)

if (process.env.NODE_ENV === 'development') {
  console.log('initialState: %o', initialState)
}

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
)
