import { createSelector }  from 'reselect'
import find from 'lodash.find'

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
  const issue = find(state.issues, { id: p.issue })
  const sectionName = find(issue.sections, { objectName: p.section }).name
  const slug = [{
    href: `/issue/${p.issue}/${p.section}`,
    text: sectionName
  }]

  return slug
}

export default {
  sectionSlug: createSelector(getSectionSlug, slug => slug),
  articleSlug: createSelector(getArticleSlug, slug => slug),
  section: createSelector(getSection, section => section),
  article: createSelector([getSection, getArticleParam], getArticle)
}
