import { combineReducers } from 'redux'
import { reducer as ui } from './ui'
import { reducer as ctx } from './ctx'

export default combineReducers({
  ctx,
  ui,
  v2: state => state || {},
})
