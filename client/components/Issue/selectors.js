import { createSelector } from 'reselect'

export const getIssues = state => state.issues

export const getLatestIssue = createSelector(
  [getIssues],
  issues => (() => {
    let max = 0
    let latestIssue
    issues.forEach(issue => {
      if (issue.id > max) {
        max = issue.id
        latestIssue = issue
      }
    })
    return latestIssue
  })()
)
