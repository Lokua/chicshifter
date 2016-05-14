import { combineReducers } from 'redux'

import { reducer as issues } from '@components/Issue'
import { reducer as fpfys } from '@components/Fpfys'
import { reducer as article } from '@components/Article'
import { reducer as limiting } from '@components/Limiting'
import { reducer as letter } from '@components/Letter'
import { reducer as ui } from './ui'

export default combineReducers({
  issues,
  fpfys,
  article,
  limiting,
  letter,
  ui
})
