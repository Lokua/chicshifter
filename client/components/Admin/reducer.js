import { createReducer } from 'redux-create-reducer'
import actions from './actions'

const initialState = {
  issue: -1,
  editorState: null,
  modalActive: false,
  editable: {
    objectName: '',
    title: '',
    image: {},

    // only used for `limiting`, will be
    // swapped with objectName server-side
    week: -1,

    // only use in `street`
    question: ''
  },
  isAuthenticated: false
}

export { initialState }

export default createReducer(initialState, {

  [actions.SET_AUTHENTICATED] (state, { isAuthenticated }) {
    console.log('reducer >> isAuthenticated:', isAuthenticated)
    return { ...state, isAuthenticated }
  },

  [actions.ADMIN_SET_EDITABLE_VALUE] (state, { key, value }) {
    const editable = { ...state.editable, [key]: value }

    return { ...state, editable }
  },

  [actions.ADMIN_OPEN_MODAL] (state, { modalActive }) {
    return { ...state, modalActive }
  },

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