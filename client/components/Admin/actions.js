import Actions from 'redux-actions-class'
import map from 'lodash.map'
import Logger from 'lokua.net.logger'
import find from 'lodash.find'
import Cookies from 'js-cookie'

import { inspect } from '@common'
import { actions as issueActions } from '@components/Issue'
import { actions as limitingActions } from '@components/Limiting'

// eslint-disable-next-line no-unused-vars
const logger = new Logger('admin/actions', {
  level: Logger.DEBUG,
  nameStyle: 'color:darkturquoise'
})

export default new Actions({

  SET_AUTHENTICATED: 'isAuthenticated',

  LOGIN (username, password) {
    return dispatch => (async () => {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'same-origin'
      })

      if (res.status !== 200) {
        dispatch(this.setAuthenticated(false))
        return alert(`${res.status}: ${res.statusText}`)
      }

      if (Cookies.get('token')) {
        dispatch(this.setAuthenticated(true))
      }
    })()
  },

  ADMIN_SET_EDITABLE_VALUE: ['key', 'value'],
  ADMIN_OPEN_MODAL: 'modalActive',
  ADMIN_SET_EDITOR_STATE: 'editorState',
  ADMIN_SELECT_ISSUE: 'id',
  ADMIN_REPLACE_ARTICLE_SUCCESS: null,
  ADMIN_REPLACE_ARTICLE_FAILURE: 'err',

  ADMIN_DELETE_ENTRY ({ issue, section, entry }) {
    return (dispatch, getState) => (async () => {
      const res = await fetch('/api/admin/delete-entry', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: Cookies.get('token')
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
          'Content-Type': 'application/json',
          Authorization: Cookies.get('token')
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

  ADMIN_REPLACE_ARTICLE (issue, section, entry, article) {
    return dispatch => (async () => {

      const res = await fetch('/api/admin/replace-article', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: Cookies.get('token')
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
    return genericPost('/api/admin/replace-image', config)
    // return dispatch => (async () => {
    //   const res = await fetch('/api/admin/replace-image', {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(config)
    //   })
    //
    //   if (res.status !== 200) {
    //     alert(`${res.status}: ${res.statusText}`)
    //     return
    //   }
    //
    //   const issues = await res.json()
    //   dispatch(issueActions.getIssuesSuccess(issues))
    // })()
  },

  ADMIN_SET_LIMITING_WEEK (issue, oldWeek, newWeek) {
    return genericPost('/api/admin/limiting/set-week', {
      issue, oldWeek, newWeek
    })
  },

  ADMIN_SET_LIMITING_TITLE (issue, week, title) {
    return genericPost('/api/admin/limiting/set-title', {
      issue, week, title
    })
  },

  ADMIN_ADD_NEW_LIMITING_ENTRY (issue, section, week) {
    return (dispatch, getState) => (async () => {
      try {
        const url = '/api/admin/limiting/entry/new'
        await dispatch(limitingActions.clearLimitingArticles())
        const issues = await post(url, { issue, section, week })
        await dispatch(issueActions.getIssuesSuccess(issues))
        const sectionObject = getState().issues[issue-1].sections.limitingChic

        logger.debug('inspect(sectionObject.content): %o',
          inspect(sectionObject.content))

        const entry = find(sectionObject.content, { objectName: String(week) })

        if (entry && entry.content) {
          const authors = Object.keys(entry.content).join(',')
          dispatch(limitingActions.fetchLimitingArticles(
            issue,
            week,
            authors
          ))

        } else {
          logger.warn(
            'entry or entry.content is null or undefined >> entry: %o',
            entry
          )
        }

      } catch (err) {
        console.error('error:', err)
      }
    })()
  },

  ADMIN_DELETE_LIMITING_ENTRY (issue, week, author) {
    return dispatch => (async () => {
      try {
        const url = '/api/admin/limiting/entry/delete'
        await dispatch(limitingActions.clearLimitingArticles())
        const issues = await post(url, { issue, week, author })
        await dispatch(issueActions.getIssuesSuccess(issues))
      } catch (err) {
        console.error(err)
      }
    })()
  },

  ADMIN_SAVE_LIMITING_ENTRY_AUTHOR (issue, week, oldAuthor, newAuthor) {
    return genericPost('/api/admin/limiting/entry/save-author', {
      issue, week, oldAuthor, newAuthor
    })
  },

  ADMIN_ADD_LIMITING_ENTRY_IMAGE (issue, week, author) {
    return genericPost('/api/admin/limiting/entry/new-image', {
      issue, week, author
    })
  },

  ADMIN_REPLACE_LIMITING_ENTRY_IMAGE (
      issue, week, author, index, fileName, data) {
    return genericPost('/api/admin/limiting/entry/replace-image', {
      issue, week, author, index, fileName, data
    })
  },

  ADMIN_SET_ENTRY_IMAGE_ROTATION (issue, week, author, index, value) {
    return genericPost('/api/admin/limiting/entry/rotate', {
      issue, week, author, index, value
    })
  },

  ADMIN_DELETE_ENTRY_IMAGE (issue, week, author, index) {
    return genericPost('/api/admin/limiting/entry/delete-image', {
      issue, week, author, index
    })
  },

  ADMIN_STREET_UPDATE (issue, entry, title, question) {
    return genericPost('/api/admin/street/update', {
      issue, entry, title, question
    })
  },

  ADMIN_STREET_REPLACE_IMAGE (issue, entry, fileName, data) {
    return genericPost('/api/admin/street/replace-image', {
      issue, entry, fileName, data
    })
  },

  ADMIN_STREET_UPDATE_ENTRY (issue, entry, index, person, age, answer) {
    return genericPost('/api/admin/street/entry/update', {
      issue, entry, index, person, age, answer
    })
  },

  ADMIN_STREET_REPLACE_ENTRY_IMAGE (issue, entry, index, fileName, data) {
    return genericPost('/api/admin/street/entry/replace-image', {
      issue, entry, index, fileName, data
    })
  },

  ADMIN_STREET_NEW_ITEM (issue, entry) {
    return genericPost('/api/admin/street/entry/new', {
      issue, entry
    })
  },

  ADMIN_STREET_DELETE_ITEM (issue, entry, index) {
    return genericPost('/api/admin/street/entry/delete', {
      issue, entry, index
    })
  }
})

function genericPost(url, config) {
  return dispatch => (async () => {
    try {
      const issues = await post(url, config)
      await dispatch(issueActions.getIssuesSuccess(issues))
    } catch (e) {
      console.error(err)
    }
  })()
}

// TODO: move me to util or ajax util in @common
async function post(url, data, errorHandler) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: Cookies.get('token')
    },
    body: JSON.stringify(data)
  })

  if (res.status === 200) {
    return res.json()
  }

  return Promise.reject(res)
}
