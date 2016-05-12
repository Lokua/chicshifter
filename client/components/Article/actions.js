import Actions from 'redux-actions-class'

export default new Actions({
  FETCH_ARTICLE_SUCCESS: 'article',
  FETCH_ARTICLE_FAILURE: 'error',
  FETCH_ARTICLE (...args) {
    return dispatch => (async () => {
      const url = `/api/article/${args.join('/')}`
      const res = await fetch(url)
      // TODO: error handle
      const text = await res.text()
      dispatch(this.fetchArticleSuccess(text))
    })()
  }
})
