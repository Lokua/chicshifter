import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { RouterContext, match, createMemoryHistory  } from 'react-router'

import pkg from '../package.json'
import config from '../config'
import Logger from './Logger'
import { getIssues, getFpfys } from './api'

import { routes, configureStore } from '@common'

const logger = new Logger('render')

export default async function render(ctx) {

  const issues = await getIssues()
  const fpfys = await getFpfys()

  match({
    routes,
    location: ctx.url,
    history: createMemoryHistory(ctx.url)
  }, (err, redirectLocation, renderProps) => {

    if (err) {
      ctx.status = 500
      ctx.body = 'damn, son'

    } else if (redirectLocation) {
      logger.warn('redirectLocation is not yet implemented')

    } else if (renderProps) {

      const store = configureStore({
        issues,
        fpfys
      })

      logger.debug('initialState: %j', store.getState())

      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      ctx.body = renderPage(
        html,
        store.getState(),
        Object.assign(pkg, {
          url: ctx.url
        })
      )
    }
  })
}

function renderPage(html, initialState, meta) {
  const style = process.env.NODE_ENV === 'production' ? 'style.css' : ''

  return '' +
`<!-- ${meta.url} -->
<!--
  ${meta.name} version ${meta.version}
  ${meta.author}
  ${meta.license} licensed
-->
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name=viewport content="width=device-width, initial-scale=1">
  <title>${meta.name}</title>
  <link rel="stylesheet" href="${style}">
  <style>
    body {
      /* prevent FOUC, see @components/App */
      display: none;
    }
  </style>
</head>
<body>
  <div id="root">${html}</div>
  <script id="initialState">
    window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
  </script>
  <script src="${config.server.bundle}"></script>
</body>
</html>`
}
