import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import find from 'lodash.find'

import { actions as articleActions } from '@components/Article'
import { actions as limitingActions } from '@components/Limiting'
import actions from './actions'
import TextEditor from './TextEditor.jsx'
import css from './style.scss'

const mapStateToProps = (state, props) => ({
  article: state.article,
  articles: state.limiting,
  entry: (() => {
    const sections = state.issues[props.params.issue - 1].sections
    const section = find(sections, { objectName: props.params.section })
    const entry = find(section.content, { objectName: props.params.entry })

    return entry
  })()
})

const mapDispatchToProps = (dispatch, props) => ({
  getArticle() {
    const { issue, section, entry } = props.params
    if (/(see|shopp|tour)ing/.test(section)) {
      dispatch(articleActions.fetchArticle(
        issue, section, entry, 'text.html'))

    } else {
      dispatch(articleActions.fetchArticle(issue, section, entry))
    }
  },
  getArticles(persons) {
    const { issue, entry } = props.params
    return dispatch(limitingActions.fetchLimitingArticles(
      issue,
      entry,
      persons
    ))
  },
  clearArticles() {
    return dispatch(limitingActions.clearLimitingArticles())
  },
  replaceArticle(config) {
    const { issue, section, entry } = props.params

    if (/(consider|see|shopp|tour)ing/.test(section)) {
      dispatch(actions.adminReplaceArticle(issue, section, entry, config.text))

    } else {
      dispatch(actions.adminReplaceArticle(
        issue,
        section,

        // entry===week#, objectName===ie."ana"
        `${entry}/${config.meta.objectName}`,

        config.text
      ))
    }
  }
})

class EditEntry extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    getArticle: PropTypes.func.isRequired,
    getArticles: PropTypes.func.isRequired,
    article: PropTypes.string,
    articles: PropTypes.arrayOf(PropTypes.string),
    replaceArticle: PropTypes.func.isRequired,
    clearArticles: PropTypes.func.isRequired
  }

  componentWillMount() {
    // TODO: scroll to top
  }

  componentDidMount() {
    if (/(consider|see|shopp|tour)ing/.test(this.props.params.section)) {
      this.props.getArticle()

    } else if (this.props.params.section === 'limiting') {
      const persons = []
      Object.keys(this.props.entry.content).forEach(author => {
        const entry = this.props.entry.content[author]
        if (entry.textUrl) persons.push(author)
      })
      if (persons.length) this.props.getArticles(persons.join(','))
    }
  }

  componentWillUnmount() {
    this.props.clearArticles()
  }

  @autobind
  considering() {
    const { entry, article } = this.props
    if (article) {
      return (
        <TextEditor
          meta={{
            objectName: entry.objectName,
            title: entry.title
          }}
          onSave={this.props.replaceArticle}
        />
      )
    }
  }

  @autobind
  limiting() {
    const { entry, articles } = this.props

    if (articles && articles.length) {
      const authors = Object.keys(this.props.entry.content)
      return (
        <div>
          {articles.map((text, i) => {
            const content = entry.content[authors[i]]
            return (
              <div key={i} className={css.editable}>
                <h2>Meta/Text content:</h2>
                <TextEditor
                  meta={{
                    objectName: content.objectName,
                    title: 'N/A',
                  }}
                  onSave={this.props.replaceArticle}
                  index={i}
                />
                <h2>Images:</h2>
                <div>
                  {content.images.map(image => (
                    <div>{image.src}, {image.rotate}</div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )
    }
  }

  @autobind
  seeing() {
    const { entry, article, params } = this.props
    const { issue, section } = params

    if (article) {
      const prefix = `/static/issues/${issue}/${section}`
      return (
        <div>

          <div className={css.editable}>
            <h2>Thumb Image</h2>
            <img
              style={{ width: '256px', height: 'auto' }}
              src={`${prefix}/${entry.image.src}`}
            />
          </div>

          <div className={css.editable}>
            <h2>Text Content:</h2>
            <TextEditor
              meta={{
                objectName: entry.objectName,
                title: entry.title
              }}
              onSave={this.props.replaceArticle}
            />
          </div>

          <div className={`${css.editable}`}>
            <h2>Gallery Images:</h2>
            <button className={css.button}>New</button>
            <div className={css.gallery}>
              {entry.content.images && entry.content.images.length &&
                entry.content.images.map((image, i) => (
                  <div key={i} className={`${css.galleryItem} ${css.editable}`}>
                    <h3>Image:</h3>
                    <button className={css.button}>Replace</button>
                    <button className={css.button}>Delete</button>
                    <br />
                    <img
                      style={{ width: '128px', height: 'auto' }}
                      src={`${prefix}/${params.entry}/${image.src}`}
                    />
                    <h3>Credits:</h3>
                    <button className={css.button}>New</button>
                    {image.credits && image.credits.length &&
                      image.credits.map((credit, i) => (
                        <div key={i} className={css.editable}>
                          <div>type: {credit.type}</div>
                          <div>author: {credit.author.name}</div>
                          <button className={css.button}>Edit</button>
                          <button className={css.button}>Delete</button>
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )
    }
  }

  @autobind
  shopping() {
    return this.seeing()
  }

  @autobind
  street() {
    return (
      <div>Hello!</div>
    )
  }

  @autobind
  touring() {
    return this.seeing()
  }

  render() {
    const { entry, params } = this.props

    return (
      <div className={css.Admin}>
        {this[params.section]()}
        <pre>{JSON.stringify(entry, null, 2)}</pre>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEntry)
