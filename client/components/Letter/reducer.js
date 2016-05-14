import { createReducer } from 'redux-create-reducer'
import actions from './actions'

export default createReducer('', {
  [actions.FETCH_LETTER_SUCCESS] (state, { letter }) {
    return letter
  }
})
