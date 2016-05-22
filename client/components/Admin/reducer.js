import { createReducer } from 'redux-create-reducer'
import actions from './actions'

const initialState = {
  issue: -1,
  editorState: null
}

export default createReducer(initialState, {

  [actions.ADMIN_SET_EDITOR_STATE] (state, { editorState }) {
    return { ...state, editorState }
  },

  [actions.ADMIN_SELECT_ISSUE] (state, { id }) {
    return { ...state, issue: id }
  },

  [actions.ADMIN_REPLACE_ARTICLE_SUCCESS] (state) {
    alert('File save was successful!')

    return state
  },

  [actions.ADMIN_REPLACE_ARTICLE_FAILURE] (state, { err }) {
    console.log('ADMIN_REPLACE_ARTICLE_FAILURE >> err:', err)
    const msg = 'Please contact web master with the information printed above'
    alert(`${err.status}: ${err.statusText}\n\n${msg}`)

    return state
  }
})
