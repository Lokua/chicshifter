import { createReducer } from 'redux-create-reducer'
import actions from './actions'

export default createReducer([], {
  TEST (state, { test }) {
    console.log('test:', test)
    return state
  },

  [actions.GET_ISSUES_SUCCESS] (state, { issues }) {
    return issues
  },

  [actions.GET_ISSUES_FAILURE] (state, { err }) {
    console.error('GET_ISSUES_FAILURE >> err: %o', err)
    return state
  }
})
