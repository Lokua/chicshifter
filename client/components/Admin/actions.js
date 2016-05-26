import Actions from 'redux-actions-class'
import map from 'lodash.map'

import { actions as issueActions } from '@components/Issue'
import { actions as limitingActions } from '@components/Limiting'

export default new Actions({

  ADMIN_DELETE_ENTRY ({ issue, section, entry }) {
    return (dispatch, getState) => (async () => {
      const res = await fetch('/api/admin/delete-entry', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          issue,
          section,
          entry
        })
      })

      if (res.status !== 200) {
        alert(`${res.status}: ${res.statusText}`)
      } else {
        const issues = await res.json()
        dispatch(issueActions.getIssuesSuccess(issues))
        dispatch(this.adminOpenModal(false))
      }
    })()
  },

  ADMIN_SUBMIT_EDITABLE ({ issue, section, entry }) {
    return (dispatch, getState) => (async () => {
      const res = await fetch('/api/admin/create-entry', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          issue,
          section,
          entry,
          object: getState().admin.editable
        })
      })

      if (res.status !== 200) {
        alert(`${res.status}: ${res.statusText}`)

      } else {
        const issues = await res.json()
        dispatch(issueActions.getIssuesSuccess(issues))
        dispatch(this.adminOpenModal(false))
      }
    })()
  },

  ADMIN_SET_EDITABLE_VALUE: ['key', 'value'],
  ADMIN_OPEN_MODAL: 'modalActive',
  ADMIN_SET_EDITOR_STATE: 'editorState',
  ADMIN_SELECT_ISSUE: 'id',
  ADMIN_REPLACE_ARTICLE_SUCCESS: null,
  ADMIN_REPLACE_ARTICLE_FAILURE: 'err',

  ADMIN_REPLACE_ARTICLE (issue, section, entry, article) {
    return dispatch => (async () => {

      const res = await fetch('/api/admin/replace-article', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          issue,
          section,
          entry,
          article
        })
      })

      if (res.status !== 200) {
        const message = await res.json()
        return dispatch(this.adminReplaceArticleFailure({
          status: res.status,
          statusText: message
            ? map(message, (value, key) => {
                return `${key}: ${value}`
              }).join('\n')
            : res.statusText
        }))
      }

      const getIssues = dispatch(issueActions.getIssues())
      console.log('getIssues:', getIssues)
      dispatch(this.adminReplaceArticleSuccess())
    })()
  },

  /**
   * @param {Object} config
   * @property {String} config.issue
   * @property {String} config.section
   * @property {String} [config.entry]
   * @property {String} config.fileName
   * @property {String} config.imageData
   */
  ADMIN_REPLACE_IMAGE (config) {
    return dispatch => (async () => {
      const res = await fetch('/api/admin/replace-image', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      if (res.status !== 200) {
        alert(`${res.status}: ${res.statusText}`)
        return
      }

      const issues = await res.json()
      dispatch(issueActions.getIssuesSuccess(issues))
    })()
  },

  ADMIN_SET_LIMITING_WEEK (issue, oldWeek, newWeek) {
    return dispatch => (async () => {
      try {
        const url = '/api/admin/limiting/set-week'
        const issues = await post(url, { issue, oldWeek, newWeek })
        dispatch(issueActions.getIssuesSuccess(issues))
      } catch (err) {
        console.error('error:', err)
      }
    })()
  },

  ADMIN_SET_LIMITING_TITLE (issue, week, title) {
    return dispatch => (async () => {
      try {
        const url = '/api/admin/limiting/set-title'
        const issues = await post(url, { issue, week, title })
        await dispatch(issueActions.getIssuesSuccess(issues))
      } catch (err) {
        console.error('error:', err)
      }
    })()
  },

  ADMIN_ADD_NEW_LIMITING_ENTRY (issue, section, week) {
    return (dispatch, getState) => (async () => {
      try {
        const url = '/api/admin/limiting/entry/new'
        const issues = await post(url, { issue, section, week })
        await dispatch(issueActions.getIssuesSuccess(issues))
        const sectionObject = getState().issues[issue-1].sections.limitingChic
        const entry = find(sectionObject.content, { objectName: String(week) })
        const authors = Object.keys(entry.content).join(',')
        dispatch(limitingActions.fetchLimitingArticles(
          issue,
          week,
          authors
        ))
      } catch (err) {
        console.error('error:', err)
      }
    })()
  },

  ADMIN_DELETE_LIMITING_ENTRY (issue, week, author) {
    return dispatch => (async () => {
      try {
        const url = '/api/admin/limiting/entry/delete'
        const issues = await post(url, { issue, week, author })
        await dispatch(issueActions.getIssuesSuccess(issues))
      } catch (err) {
        console.error(err)
      }
    })()
  },

  ADMIN_SAVE_LIMITING_ENTRY_AUTHOR (issue, week, oldAuthor, newAuthor) {
    return dispatch => (async () => {
      try {
        const url = '/api/admin/limiting/entry/save-author'
        const issues = await post(url, { issue, week, oldAuthor, newAuthor })
        await dispatch(issueActions.getIssuesSuccess(issues))
      } catch (e) {
        console.error(err)
      }
    })()
  },

  ADMIN_ADD_LIMITING_ENTRY_IMAGE (issue, week, image, data) {
    return dispatch => (async () => {
      try {
        const url = '/api/admin/limiting/entry/new-image'
        const issues = await post(url, { issue, week, image, data })
        await dispatch(issueActions.getIssuesSuccess(issues))
      } catch (e) {
        console.error(err)
      }
    })()
  }
})

// TODO: move me to util or ajax util in @common
async function post(url, data, errorHandler) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (res.status === 200) {
    return res.json()
  }

  return Promise.reject(res)
}
