import Actions from 'redux-actions-class'
import { createReducer } from 'redux-create-reducer'

export const actions = new Actions({
  SET_ACTIVE_ISSUE_NUMBER: `activeIssueNumber`,
  SET_PATHNAME: `pathname`
})

const initialState = {
  activeIssueNumber: -1,
  pathname: `/`
}

export const reducer = createReducer(initialState, {
  [actions.SET_ACTIVE_ISSUE_NUMBER]: (state, { activeIssueNumber }) => ({
    ...state,
    activeIssueNumber: parseInt(activeIssueNumber, 10)
  }),
  [actions.SET_PATHNAME]: (state, { pathname }) => ({
    ...state,
    pathname
  })
})
