import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { RouterContext, match, createMemoryHistory  } from 'react-router'

import pkg from '../package.json'
import config from '../config'
import Logger from './Logger'
import { renderOpenGraphTags } from './openGraph'
import populateIssues from './db'

import { routes, configureStore } from '@common'

// eslint-disable-next-line
const logger = new Logger('render')

export default async function render(ctx) {
  const v2 = await populateIssues()

  const matchConfig = {
    routes,
    location: ctx.url,
    history: createMemoryHistory(ctx.url)
  }

  match(matchConfig, (err, redirectLocation, renderProps) => {
    if (err) {
      ctx.status = 500

    } else if (renderProps) {

      const store = configureStore({
        v2: v2
      })

      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      const state = store.getState()

      ctx.body = renderPage(
        html,
        state,

        // meta
        Object.assign(pkg, {
          url: ctx.url,
          ogTags: renderOpenGraphTags(ctx, state, renderProps)
        })
      )
    } else {
      logger.warn('render else block')
    }
  })
}

function renderPage(html, initialState, meta) {
  const style = process.env.NODE_ENV === 'production' ? '/static/style.css' : ''

  return '' +
`<!-- ${meta.url} -->
<!--
  ${meta.name} version ${meta.version}
  ${meta.author}
  ${meta.license} licensed
-->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="application-name" content="Chic Shifter">
  <meta name="description" content="a digital fashion journal">
  <meta name="subject" content="Fashion">
  <meta name="rating" content="General">
  ${meta.ogTags}
  <title>${meta.name}</title>
  <link href="/static/images/favicon.ico" rel="icon" sizes="16x16" type="image/x-icon">
  <link href="/static/fonts/chicshifter-icons/style.css" rel="stylesheet">
  <link href="${style}" rel="stylesheet">
  <style>body { display: none; }</style>
</head>
<body>
  <div id="root">${html}</div>
  <script id="initialState">
    window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
  </script>
  <script async src="${config.server.bundle}"></script>
</body>
</html>`
}
