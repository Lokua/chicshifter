import Actions from 'redux-actions-class'

export default new Actions({

  GET_ISSUES_SUCCESS: 'issues',
  GET_ISSUES_FAILURE: 'err',

  GET_ISSUES () {
    return dispatch => (async () => {
      try {
        const res = await fetch('/api/issues')
        const issues = await res.json()
        dispatch(this.getIssuesSuccess(issues))
      } catch (err) {
        dispatch(this.getIssuesFailure(err))
      }
    })()
  }
})
