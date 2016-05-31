import Router from 'koa-router'

// authenticate is handled in main router file
// import { authorize } from '../middleware/auth'

import replaceImage from './replaceImage'
import replaceArticle from './replaceArticle'
import createEntry from './createEntry'
import deleteEntry from './deleteEntry'
import setTitle from './setTitle'
import * as limiting from './limiting'
import * as street from './street'
import * as seeing from './seeing'
import * as fpfys from './fpfys'

const admin = new Router({ prefix: '/api/admin' })

// require all admin access points to be authenticated
// admin.use('*', authorize)


admin.post('/fpfys/update', fpfys.update)
admin.post('/fpfys/add', fpfys.add)
admin.post('/fpfys/delete', fpfys.del)
admin.post('/fpfys/replace-image', fpfys.replaceImage)

// all pages
admin.post('/replace-image', replaceImage)
admin.post('/replace-article', replaceArticle)
admin.post('/create-entry', createEntry)
admin.post('/delete-entry', deleteEntry)
admin.post('/set-title', setTitle)

admin.post('/add-gallery-image', seeing.addGalleryImage)
admin.post('/delete-gallery-image', seeing.deleteGalleryImage)
admin.post('/set-gallery-image-rotation', seeing.setGalleryImageRotation)
admin.post('/replace-gallery-image', seeing.replaceGalleryImage)

// limiting
admin.post('/limiting/set-week', limiting.setWeek)
admin.post('/limiting/set-title', limiting.setTitle)
admin.post('/limiting/entry/new', limiting.newEntry)
admin.post('/limiting/entry/delete', limiting.deleteEntry)
admin.post('/limiting/entry/save-author', limiting.saveAuthor)
admin.post('/limiting/entry/new-image', limiting.newImage)
admin.post('/limiting/entry/replace-image', limiting.replaceEntryImage)
admin.post('/limiting/entry/rotate', limiting.setEntryImageRotation)
admin.post('/limiting/entry/delete-image', limiting.deleteEntryImage)

// street
admin.post('/street/update', street.update)
admin.post('/street/replace-image', street.replaceImage)
admin.post('/street/entry/update', street.updateEntry)
admin.post('/street/entry/replace-image', street.replaceEntryImage)
admin.post('/street/entry/new', street.newItem)
admin.post('/street/entry/delete', street.deleteItem)

export api from './api'
export { getIssues, getFpfys } from './api'
export { admin }
