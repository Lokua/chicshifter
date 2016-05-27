import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import find from 'lodash.find'

import { loadFile, injectLogger, removeIndexOf/*, uiActions*/ } from '@common'
import { actions as articleActions } from '@components/Article'
import { actions as limitingActions } from '@components/Limiting'
import { Slug } from '@components/Slug'
import { Modal } from '@components/Modal'
import { Button } from '@components/Button'
import { FileButton } from '@components/FileButton'
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
  })(),
  modalActive: state.admin.modalActive
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
  },
  addNewLimitingEntry(author) {
    const { issue, section, entry: week } = props.params
    return dispatch(actions.adminAddNewLimitingEntry(issue, section, week))
  },
  setLimitingWeek(newWeek) {
    const { issue, entry: oldWeek } = props.params
    return dispatch(actions.adminSetLimitingWeek(issue, oldWeek, newWeek))
  },
  setLimitingTitle(title) {
    const { issue, entry: week } = props.params
    return dispatch(actions.adminSetLimitingTitle(issue, week, title))
  },
  deleteLimitingEntry(author) {
    const { issue, entry /* aka `week` */ } = props.params
    return dispatch(actions.adminDeleteLimitingEntry(issue, entry, author))
  },
  saveLimitingEntryAuthor(oldAuthor, newAuthor) {
    const { issue, entry /* aka `week` */ } = props.params
    return dispatch(
      actions.adminSaveLimitingEntryAuthor(issue, entry, oldAuthor, newAuthor)
    )
  },
  addLimitingEntryImage(author) {
    const { issue, entry } = props.params
    return dispatch(actions.adminAddLimitingEntryImage(issue, entry, author))
  },
  openModal(open) {
    return dispatch(actions.adminOpenModal(open))
  },
  replaceLimitingEntryImage(author, index, fileName, data) {
    const { issue, entry } = props.params
    return dispatch(actions.adminReplaceLimitingEntryImage(
      issue, entry, author, index, fileName, data
    ))
  },
  setEntryImageRotation(author, index, value) {
    const { issue, entry } = props.params
    return dispatch(actions.adminSetEntryImageRotation(
      issue, entry, author, index, value
    ))
  },
  deleteEntryImage(author, index) {
    const { issue, entry } = props.params
    return dispatch(actions.adminDeleteEntryImage(
      issue, entry, author, index
    ))
  },
  streetUpdate(title, question) {
    const { issue, entry } = props.params
    return dispatch(actions.adminStreetUpdate(issue, entry, title, question))
  },
  streetReplaceImage(fileName, data) {
    const { issue, entry } = props.params
    return dispatch(
      actions.adminStreetReplaceImage(issue, entry, fileName, data)
    )
  },
  streetUpdateEntry(index, person, age, answer) {
    const { issue, entry } = props.params
    return dispatch(
      actions.adminStreetUpdateEntry(issue, entry, index, person, age, answer)
    )
  },
  streetReplaceEntryImage(index, fileName, data) {
    const { issue, entry } = props.params
    return dispatch(
      actions.adminStreetReplaceEntryImage(issue, entry, index, fileName, data)
    )
  },
})

@injectLogger
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
    replaceImage: PropTypes.func.isRequired,
    addNewLimitingEntry: PropTypes.func.isRequired,
    setLimitingWeek: PropTypes.func.isRequired,
    setLimitingTitle: PropTypes.func.isRequired,
    deleteLimitingEntry: PropTypes.func.isRequired,
    saveLimitingEntryAuthor: PropTypes.func.isRequired,
    addLimitingEntryImage: PropTypes.func.isRequired,
    modalActive: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    replaceLimitingEntryImage: PropTypes.func.isRequired,
    setEntryImageRotation: PropTypes.func.isRequired,
    deleteEntryImage: PropTypes.func.isRequired,
    streetUpdate: PropTypes.func.isRequired,
    streetReplaceImage: PropTypes.func.isRequired,
    streetUpdateEntry: PropTypes.func.isRequired,
    streetReplaceEntryImage: PropTypes.func.isRequired
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

        <aside className={css.well}>
          <b>Important:</b><br />
          Selecting "Choose File" will replace the current file
          immediately and without confirmation. This action
          cannot be undone.
        </aside>

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

        <div className={css.formGroup}>
          <label>Week:</label>
          <input
            type="number"
            defaultValue={entry.objectName}
            ref="weekInput"
          />
          <button
            className={css.button}
            onClick={e => this.props.setLimitingWeek(
              this.refs.weekInput.value
            )}
          >
            Save
          </button>
        </div>

        <div className={css.formGroup}>
          <label>Title:</label>
          <input type="text" defaultValue={entry.title} ref="titleInput" />
          <button
            className={css.button}
            onClick={e => this.props.setLimitingTitle(
              this.refs.titleInput.value
            )}
          >
            Save
          </button>
        </div>

        {this.renderImageReplacer()}

        <button
          className={css.button}
          onClick={this.props.addNewLimitingEntry}
        >
          Add New Entry
        </button>

        {articles && !!articles.length && articles.map((text, i) => {
          const author = authors[i]
          const content = entry.content[author]

          return (
            <div key={i} className={css.editable}>
              <h1>{content.objectName}</h1>
              <div className={css.formGroup}>
                <button
                  className={css.button}
                  onClick={async () => {
                    await this.props.deleteLimitingEntry(content.objectName)
                    const persons = removeIndexOf(authors, author)
                    if (persons.length) {
                      this.props.getArticles(persons.join(','))
                    }
                  }}
                >
                  Delete
                </button>
              </div>

              <hr />

              <div className={css.formGroup}>
                <label>Contributor</label>
                <input
                  type="text"
                  defaultValue={content.objectName}
                  ref="entryAuthorInput"
                />
                <button
                  className={css.button}
                  onClick={() => {
                    this.props.saveLimitingEntryAuthor(
                      content.objectName,
                      this.refs.entryAuthorInput.value
                    )
                  }}
                >
                  Save
                </button>
              </div>

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
                onClick={() =>
                  this.props.addLimitingEntryImage(content.objectName)
                }
              >
                New
              </button>
              <div className={css.limitThumbs}>
                {content.images.map((image, i) => (
                  <div key={i} className={css.limitThumb}>

                    <div className={css.formGroup}>
                      <label>{image.title}</label>
                      {image.src &&
                        <div
                          className={css.image}
                          style={{
                            backgroundImage:
                              `url('${srcPrefix}/${author}/${image.src}')`,
                            transform: `rotate(${image.rotate || 0}deg)`
                          }}
                        />
                      }
                      {!image.src && <div>No image</div>}
                      <FileButton
                        className={css.button}
                        handler={(fileName, data) => {
                          this.props.replaceLimitingEntryImage(
                            content.objectName,
                            i,
                            fileName,
                            data
                          )
                        }}
                        text="Replace"
                      />
                    </div>

                    <hr />

                    <div className={css.formGroup}>
                      <label>Rotate (deg):</label>
                      <input
                        type="number"
                        defaultValue={image.rotate || 0}
                        ref={`rotateInput:${i}`}
                      />
                      <button
                        className={css.button}
                        onClick={e =>
                          this.props.setEntryImageRotation(
                            content.objectName,
                            i,
                            this.refs[`rotateInput:${i}`].value
                          )
                        }
                      >
                        Save
                      </button>
                    </div>

                    <hr />

                    <button
                      className={css.button}
                      onClick={() =>
                        this.props.deleteEntryImage(content.objectName, i)
                      }
                    >
                      Delete
                    </button>

                  </div>
                ))}
              </div>

              <Modal
                isOpen={this.props.modalActive}
                onRequestClose={() => {
                  this.props.openModal(false)
                }}
              >
                <input
                  type="file"
                  onChange={e => {
                    this.props.openModal(false)
                    // this.props.replaceLimitingEntryImage()
                  }}
                />
              </Modal>
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
    const { entry, params } = this.props
    const { issue, section } = params
    const sectionPath = `/static/issues/${issue}/${section}`

    return (
      <div className={css.editable}>
        <h1>{entry.objectName}</h1>

        <div className={css.formGroup}>
          <label>Title:</label>
          <input
            type="text"
            defaultValue={entry.title}
            ref="titleInput"
          />
          <label>Question:</label>
          <input
            type="text"
            defaultValue={entry.question}
            ref="questionInput"
          />
          <Button
            onClick={() =>
              this.props.streetUpdate(
                this.refs.titleInput.value,
                this.refs.questionInput.value
              )
            }
            text="Save"
          />
        </div>
        <hr />

        <div className={css.formGroup}>
          <label>Image:</label>
          <em>{entry.image.title}</em>
          {entry.image.src &&
            <div
              className={`${css.image} ${css.street}`}
              style={{
                width: 256, height: 256,
                backgroundImage: `url('${sectionPath}/${entry.image.src}')`,
                transform: `rotate(${entry.image.rotate || 0}deg)`
              }}
            />
          }
          {!entry.image.src && <div>No image</div>}
          <aside className={css.well}>
            <b>Important:</b><br />
            Selecting "Replace" will replace the current file
            immediately and without confirmation. This action
            cannot be undone.
          </aside>
          <FileButton
            className={css.button}
            handler={this.props.streetReplaceImage}
            text="Replace"
          />
        </div>

        <div className={css.editable}>
          <label>Content:</label><br />
          <button className={css.button}>New</button>
          <hr />
          {entry.content.map((item, i) => (
            <div key={i} className={css.editable}>

              <div className={css.formGroup}>
                <label>Person:</label>
                <input
                  type="text"
                  defaultValue={item.person}
                  ref={`personInput:${i}`}
                />

                <label>Age:</label>
                <input
                  type="text"
                  defaultValue={item.age}
                  ref={`ageInput:${i}`}
                />

                <label>Answer:</label>
                <input
                  type="text"
                  defaultValue={item.answer}
                  style={{ width: '100%' }}
                  ref={`answerInput:${i}`}
                />

                <Button
                  onClick={() =>
                    this.props.streetUpdateEntry(
                      i,
                      this.refs[`personInput:${i}`].value,
                      this.refs[`ageInput:${i}`].value,
                      this.refs[`answerInput:${i}`].value
                    )
                  }
                  text="Save"
                />
              </div>
              <hr />

              <div className={css.formGroup}>
                <label>Image:</label>
                <em>{item.image}</em>
                {item.image &&
                  <div
                    className={`${css.image} ${css.street}`}
                    style={{
                      backgroundImage:
                        `url('${sectionPath}/${params.entry}/${item.image}')`,
                      transform: `rotate(${item.imageRotate || 0}deg)`
                    }}
                  />
                }
                {!entry.image.src && <div>No image</div>}
                <aside className={css.well}>
                  <b>Important:</b><br />
                  Selecting "Replace" will replace the current image
                  immediately and without confirmation. This action
                  cannot be undone.
                </aside>
                <FileButton
                  className={css.button}
                  handler={(fileName, data) =>
                    this.props.streetReplaceEntryImage(i, fileName, data)
                  }
                  text="Replace"
                />
              </div>
              <hr />

              <Button
                className='black'
                onClick={() => {}}
                text="Delete"
              />
            </div>
          ))}
        </div>

      </div>
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
