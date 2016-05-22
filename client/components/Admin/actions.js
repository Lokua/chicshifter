import Actions from 'redux-actions-class'
import { actions as issueActions } from '@components/Issue'
import map from 'lodash.map'

export default new Actions({

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
  }
})
