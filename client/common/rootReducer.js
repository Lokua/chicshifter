import { combineReducers } from 'redux'
import { reducer as ui } from './ui'

export default combineReducers({
  v2: state => state || {},
  ui
})
