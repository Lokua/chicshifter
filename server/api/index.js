import Router from 'koa-router'

import replaceImage from './replaceImage'
import replaceArticle from './replaceArticle'
import createEntry from './createEntry'
import deleteEntry from './deleteEntry'

const admin = new Router({ prefix: '/api/admin' })
admin.post('/replace-image', replaceImage)
admin.post('/replace-article', replaceArticle)
admin.post('/create-entry', createEntry)
admin.post('/delete-entry', deleteEntry)

export api from './api'
export { getIssues, getFpfys } from './api'
export { admin }
