import Actions from 'redux-actions-class'

export default new Actions({
  CLEAR_LIMITING_ARTICLES: null,
  FETCH_LIMITING_ARTICLES_SUCCESS: 'articles',
  FETCH_LIMITING_ARTICLES_FAILURE: 'error',
  FETCH_LIMITING_ARTICLES (issue, week, persons) {
    return dispatch => (async () => {
      try {
        const url = `/api/limiting-articles/${issue}/${week}/${persons}`
        const res = await fetch(url)
        if (res.status !== 200) {
          console.error(
            `FETCH_LIMITING_ARTICLES >> ${res.status}: ${res.statusText}`)
        }
        const articles = await res.json()
        dispatch(this.fetchLimitingArticlesSuccess(articles))
      } catch (err) {
        console.error('error caught in FETCH_LIMITING_ARTICLES >> err:', err)
      }
    })()
  },
  FETCH_LIMITING_ARTICLES_V2 (issue, week, persons) {
    const weekNumber = parseInt(week, 10)
    return async (dispatch, getState) => {
      const requests = getState().issues[0].v2.limiting.data.map(entry => {
        if (entry.fields.WeekNumber === weekNumber) {
          return fetch(entry.fields.HTML[0].url, {
            headers: {
              'Content-Type': 'text/html',
              mode: 'cors'
            }
          }).then(res => res.text())
        }
      })
      const articles = await Promise.all(requests)
      dispatch(this.fetchLimitingArticlesSuccess(articles))
    }
  }
})
