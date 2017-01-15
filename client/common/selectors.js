import { createSelector }  from 'reselect'
import find from 'lodash.find'
import { ident } from './util'

function getSection(state, props) {
  const issue = state.issues.filter(issue => {
    return issue.id === props.params.issue
  })[0]

  let section

  Object.keys(issue.sections).some(key => {
    if (issue.sections[key].objectName === props.params.section) {
      return section = issue.sections[key]
    }
  })

  return section
}

function getArticleParam(_, props) {
  return props.params.article
}

function getArticle(section, articleParam) {
  let article
  section.content.some(c => {
    if (c.objectName === articleParam) {
      return article = c
    }
  })

  return article
}

function getArticleSlug(state, props) {
  const p = props.params
  const issue = find(state.issues, { id: p.issue })
  const section = find(issue.sections, { objectName: p.section })
  const article = find(section.content, { objectName: p.article })

  const slug = [{
    href: `/issue/${p.issue}`,
    text: `${issue.season} ${issue.year}`
  }, {
    href: `/issue/${p.issue}/${p.section}`,
    text: section.name
  }, {
    href: `/issue/${p.issue}/${p.section}/${p.article}`,
    text: article.title
  }]

  return slug
}

function getSectionSlug(state, props) {
  const p = props.params
  const slug = [{
    href: `/issue/${p.issue}/${p.section}`,
    text: find(state.v2.sections, section => (
      section.fields.Slug === p.section
    )).fields.Name
  }]

  return slug
}

function getIssues(state) {
  return state.v2.issues
}

function getLatestIssue(issues) {
  let latest = issues[0]

  issues.slice(1).forEach(issue => {
    if (issue.fields.Number > latest.fields.Number) {
      latest = issue
    }
  })

  return latest
}

function getActiveIssueNumber(state) {
  return state.ctx.activeIssueNumber
}

function getActiveIssue(issues, activeIssueNumber) {
  return issues.find(issue => issue.fields.Number === activeIssueNumber)
}

function getPathname(state) {
  return state.ctx.pathname
}

export default {
  pathname: createSelector(getPathname, ident),
  activeIssue: createSelector(getIssues, getActiveIssueNumber, getActiveIssue),
  activeIssueNumber: createSelector(getActiveIssueNumber, ident),
  issues: createSelector(getIssues, ident),
  latestIssue: createSelector(getIssues, getLatestIssue),
  sectionSlug: createSelector(getSectionSlug, ident),
  articleSlug: createSelector(getArticleSlug, ident),
  section: createSelector(getSection, ident),
  article: createSelector([getSection, getArticleParam], getArticle)
}
