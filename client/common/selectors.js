import { createSelector }  from 'reselect'
import find from 'lodash.find'
import { ident } from './util'

function getSections(state) {
  return state.v2.sections
}

function getSection(state, props) {
  return state.v2[props.params.section].data.map(
    _createIssueAndEnabledFilter(state)
  )
}

function getSectionMeta(state, props) {
  const section = state.v2[props.params.section]
  const metaKey = section.meta ? `meta` : `data`

  const meta = section[metaKey].filter(_createIssueAndEnabledFilter(state))
  return meta
}

function getSectionData(state, props) {
  const section = state.v2[props.params.section]
  return section.data.filter(_createIssueAndEnabledFilter(state))
}

function _createIssueAndEnabledFilter(state) {
  return x => x.fields.Issue === state.ctx.activeIssueNumber && x.fields.Enabled
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
    .filter(issue => issue.fields.Enabled)
    .sort((a, b) => {
      const x = +a.fields.Year
      const y = +b.fields.Year

      if (x > y) {
        return -1
      }

      if (x < y) {
        return 1
      }

      return a.fields.Season === 'Spring/Summer' ? 1 : -1
    })
}

function getLatestIssue(issues) {
  let latest = issues.find(issue => issue.fields.Number === 1)

  issues.forEach(issue => {
    if (issue.fields.Enabled && issue.fields.Number > latest.fields.Number) {
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
  sections: createSelector(getSections, ident),
  section: createSelector(getSection, ident),
  sectionMeta: createSelector(getSectionMeta, ident),
  data: createSelector(getSectionData, ident),
  article: createSelector([getSection, getArticleParam], getArticle)
}
