import Router from 'koa-router'

import replaceImage from './replaceImage'
import replaceArticle from './replaceArticle'
import createEntry from './createEntry'
import deleteEntry from './deleteEntry'
import { newEntry, setWeek, setTitle, deleteEntry as delEntry,
  saveAuthor, newImage } from './limiting'

const admin = new Router({ prefix: '/api/admin' })

// all pages
admin.post('/replace-image', replaceImage)
admin.post('/replace-article', replaceArticle)
admin.post('/create-entry', createEntry)
admin.post('/delete-entry', deleteEntry)

// limiting
admin.post('/limiting/set-week', setWeek)
admin.post('/limiting/set-title', setTitle)
admin.post('/limiting/entry/new', newEntry)
admin.post('/limiting/entry/delete', delEntry)
admin.post('/limiting/entry/save-author', saveAuthor)
admin.post('/limiting/entry/new-image', newImage)

export api from './api'
export { getIssues, getFpfys } from './api'
export { admin }
