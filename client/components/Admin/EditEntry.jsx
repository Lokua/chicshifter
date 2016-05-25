import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import find from 'lodash.find'

import { loadFile } from '@common'
import { actions as articleActions } from '@components/Article'
import { actions as limitingActions } from '@components/Limiting'
import { Slug } from '@components/Slug'
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
  },
  replaceImage(config) {
    console.log(config)
    return dispatch(actions.adminReplaceImage(config))
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
    clearArticles: PropTypes.func.isRequired,
    replaceImage: PropTypes.func.isRequired
  }

  componentWillMount() {
    // TODO: scroll to top
  }

  componentDidMount() {
    if (/(consider|see|shopp|tour)ing/.test(this.props.params.section)) {
      this.props.getArticle()

    } else if (this.props.params.section === 'limiting') {
      const persons = Object.keys(this.props.entry.content)
      if (persons.length) this.props.getArticles(persons.join(','))
    }
  }

  componentWillUnmount() {
    this.props.clearArticles()
  }

  @autobind
  replaceImage(nativeEvent) {
    const { issue, section, entry } = this.props.params

    loadFile(nativeEvent, (fileName, data) => {
      this.props.replaceImage({
        issue,
        section,
        entry,
        fileName,
        data
      })
    })
  }

  @autobind
  renderImageReplacer() {
    const { entry, params } = this.props
    const { issue, section } = params

    return (
      <div className={css.editable}>
        <h2>Image</h2>
        <img
          style={{ width: '256px', height: 'auto' }}
          src={`/static/issues/${issue}/${section}/${entry.image.src}`}
        />
        <br />
        {/*<label>Replace</label><br />*/}

        <div className={css.well}>
          <b>Important:</b><br />
          Selecting "Choose File" will replace the current file
          immediately and without confirmation. This action
          cannot be undone.
        </div>

        <input
          type="file"
          onChange={e => this.replaceImage(e.nativeEvent)}
        />
      </div>
    )
  }

  @autobind
  renderTextEditor() {
    const { entry } = this.props

    return (
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
    )
  }

  @autobind
  considering() {
    if (this.props.article) {
      return (
        <div>
          {this.renderImageReplacer()}
          {this.renderTextEditor()}
        </div>
      )
    }
  }

  @autobind
  limiting() {
    const { entry, articles, params } = this.props
    const { issue, section } = params

    const authors = Object.keys(this.props.entry.content)
    const srcPrefix = `/static/issues/${issue}/${section}/${params.entry}`

    return (
      <div>
        <br />
        <h1>Week {entry.objectName}</h1>
        {this.renderImageReplacer()}

        {articles && !!articles.length && articles.map((text, i) => {
          const author = authors[i]
          const content = entry.content[author]

          return (
            <div key={i} className={css.editable}>
              <h1>{content.objectName}</h1>
              <hr />
              <h2>Text content:</h2>
              <TextEditor
                meta={{
                  objectName: content.objectName,
                  title: 'N/A',
                }}
                onSave={this.props.replaceArticle}
                index={i}
              />
              <hr />
              <h2>Images:</h2>
              <button
                className={css.button}
                title="Click to add a new image to the gallery below"
              >
                New
              </button>
              <div className={css.limitThumbs}>
                {content.images.map((image, i) => (
                  <div key={i} className={css.limitThumb}>
                    <div className={css.formGroup}>
                      <label>{image.src}</label>
                      <div
                        className={css.image}
                        style={{
                          backgroundImage:
                            `url('${srcPrefix}/${author}/${image.src}')`,
                          transform: `rotate(${image.rotate || 0}deg)`
                        }}
                      />
                    </div>
                    <div className={css.formGroup}>
                      <label>Rotate (deg):</label>
                      <input
                        type="number"
                        value={image.rotate || 0}
                        onChange={() => {}}
                      />
                    </div>
                    <div className={css.formGroup}>
                      <button className={css.button}>Replace</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  @autobind
  seeing() {
    const { entry, article, params } = this.props
    const { issue, section } = params

    if (article) {
      const prefix = `/static/issues/${issue}/${section}`
      return (
        <div>
          {this.renderImageReplacer()}
          {this.renderTextEditor()}

          <div className={`${css.editable}`}>
            <h2>Gallery Images:</h2>
            <button className={css.button}>New</button>
            <div className={css.gallery}>
              {entry.content.images && !!entry.content.images.length &&
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
    const { issue, section } = params

    const prefix = `/admin/issue/${issue}`
    const slug = [
      { href: '/admin', text: 'admin' },
      { href: prefix, text: `issue ${issue}` },
      { href: `${prefix}/section/${section}`, text: section },
      { href: `${prefix}/section/${section}/${entry.objectName}`,
        text: entry.objectName }
    ]

    return (
      <div className={css.Admin}>
        <Slug path={slug} />
        {this[params.section]()}
        <pre>{JSON.stringify(entry, null, 2)}</pre>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEntry)
