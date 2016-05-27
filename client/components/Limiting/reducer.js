import { createReducer } from 'redux-create-reducer'
import actions from './actions'

export default createReducer([], {
  [actions.FETCH_LIMITING_ARTICLES_SUCCESS] (state, { articles }) {
    return articles
  },
  [actions.CLEAR_LIMITING_ARTICLES] () {
    console.log('CLEAR_LIMITING_ARTICLES...')
    return []
  }
})
