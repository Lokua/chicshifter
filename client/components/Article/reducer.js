import { createReducer } from 'redux-create-reducer'
import actions from './actions'

export default createReducer('', {
  [actions.FETCH_ARTICLE_SUCCESS] (state, { article }) {
    return article
  }
})
