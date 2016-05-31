import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState, ContentState } from 'draft-js'
import { autobind } from 'core-decorators'

import actions from './actions'
import { actions as letterActions } from '@components/Letter'
import { Slug } from '@components/Slug'
import css from './style.scss'

const mapStateToProps = (state, props) => ({
  issue: props.params.issue,
  letter: state.letter
})

const mapDispatchToProps = dispatch => ({
  fetchLetter: issue => dispatch(letterActions.fetchLetter(issue)),
  saveLetter: (issue, text) => dispatch(actions.adminSaveLetter(issue, text))
})

class EditLetter extends Component {

  static propTypes = {
    issue: PropTypes.string.isRequired,
    letter: PropTypes.string,
    fetchLetter: PropTypes.func.isRequired,
    saveLetter: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchLetter(this.props.issue).then(() => {
      this.setState({
        editorState: EditorState.createWithContent(
          ContentState.createFromText(this.props.letter)
        )
      })
    })
  }

  @autobind
  onChange(editorState) {
    this.setState({ editorState })
  }

  @autobind
  save() {
    this.props.saveLetter(
      this.props.issue,
      this.state.editorState.getCurrentContent().getPlainText()
    )
  }

  render() {
    const { issue } = this.props

    const slug = [
      { href: '/admin', text: 'admin' },
      { href: `/admin/issue/${issue}`, text: `issue ${issue}` },
      { href: `admin/issue/${issue}/letter`, text: 'letter-from-the-editor' },
    ]

    return (
      <div className={css.Admin}>

        <Slug path={slug} />

        <aside>
          <button
            className={css.button}
            onClick={() => this.save()}
          >
            Save
          </button>
        </aside>

        <main className={`${css.editable} ${css.letterEditor}`}>
          {this.state && this.state.editorState &&
            <Editor
              editorState={this.state.editorState}
              onChange={editorState => this.onChange(editorState)}
            />
          }
        </main>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(EditLetter)
