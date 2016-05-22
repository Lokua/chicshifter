import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState, ContentState } from 'draft-js'
import { autobind } from 'core-decorators'
import { injectLogger } from '@common'
import { actions as limitingActions } from '@components/Limiting'
import { actions as articleActions } from '@components/Article'

import css from './style.scss'

const mapStateToProps = (state, props) => ({
  article: state.article,
  articles: state.limiting
})

const mapDispatchToProps = dispatch => ({
  destroy: () => {
    dispatch(limitingActions.clearLimitingArticles())
    dispatch(articleActions.fetchArticleSuccess(''))
  }
})

@injectLogger
class TextEditor extends Component {

  static defaultProps = {
    index: -1
  }

  static propTypes = {
    index: PropTypes.number,
    article: PropTypes.string,
    articles: PropTypes.arrayOf(PropTypes.string),
    meta: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,

    destroy: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(
          props.index > -1
            ? props.articles[props.index]
            : props.article
        )
      )
    }
  }

  componentWillUnmount() {
    this.props.destroy()
  }

  @autobind
  onChange(editorState) {
    this.setState({ editorState })
  }

  @autobind
  save() {
    this.props.onSave({
      meta: this.props.meta,
      text: this.state.editorState.getCurrentContent().getPlainText()
    })
  }

  render() {
    const { meta } = this.props
    return (
      <div className={css.TextEditor}>
        <header>
          <div>objectName (url endpoint): <b>{meta.objectName}</b></div>
          <div>title: <b>{meta.title}</b></div>
        </header>

        <aside>
          <button
            className={css.button}
            onClick={() => this.save()}
          >
            Save
          </button>
        </aside>

        <main>
          <Editor
            editorState={this.state.editorState}
            onChange={editorState => this.onChange(editorState)}
          />
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor)
