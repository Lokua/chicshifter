import Actions from 'redux-actions-class'

export default new Actions({
  FETCH_LIMITING_ARTICLES_SUCCESS: 'articles',
  FETCH_LIMITING_ARTICLES_FAILURE: 'error',
  FETCH_LIMITING_ARTICLES (issue, week, persons) {
    return dispatch => (async () => {
      try {
        const url = `/api/limiting-articles/${issue}/${week}/${persons}`
        const res = await fetch(url)
        if (res.status !== 200) {
          // TODO: handle error
        }
        const articles = await res.json()
        dispatch(this.fetchLimitingArticlesSuccess(articles))
      } catch (err) {
        console.error('error caught in FETCH_LIMITING_ARTICLES >> err:', err)
      }
    })()
  },
  CLEAR_LIMITING_ARTICLES: null
})
