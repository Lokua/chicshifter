import { createReducer } from 'redux-create-reducer'
import actions from './actions'

export default createReducer([], {
  [actions.GET_FPFYS_SUCCESS] (state, { fpfys }) {
    return fpfys
  },
  [actions.GET_FPFYS_FAILURE] (state, { err }) {
    console.error('GET_FPFYS_FAILURE >> err: %o', err)
    return state
  }
})
