import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { autobind } from 'core-decorators'
import find from 'lodash.find'

import { injectLogger, uiActions } from '@common'
import { Modal } from '@components/Modal'
import { Dialog } from '@components/Dialog'

import actions from './actions'
import css from './style.scss'

const mapStateToProps = (state, props) => ({
  section: (() => {
    const sections = state.issues[props.params.issue - 1].sections

    return find(sections, { objectName: props.params.section })
  })(),
  modalActive: state.admin.modalActive,
  editable: state.admin.editable,
  dialogActive: state.ui.dialogActive
})

const mapDispatchToProps = dispatch => ({
  openModal: open => dispatch(actions.adminOpenModal(open)),
  setEditableValue: (key, value) =>
    dispatch(actions.adminSetEditableValue(key, value)),
  submitEditable: config => dispatch(actions.adminSubmitEditable(config)),
  deleteEntry: config => dispatch(actions.adminDeleteEntry(config)),
  showDialog: show => dispatch(uiActions.showDialog(show))
})

@injectLogger
class EditSection extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    section: PropTypes.object.isRequired,
    modalActive: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    editable: PropTypes.object.isRequired,
    setEditableValue: PropTypes.func.isRequired,
    submitEditable: PropTypes.func.isRequired,
    deleteEntry: PropTypes.func.isRequired,
    dialogActive: PropTypes.bool.isRequired,
    showDialog: PropTypes.func.isRequired
  }

  @autobind
  uploadSectionThumb() {
    alert('Sorry. This feature has not yet been implemented.')
  }

  @autobind
  deleteEntry(entry) {
    // eslint-disable-next-line
    const { issue, section } = this.props.params
    this.props.showDialog(true)

    // defined here so we can supply entry (not available in any state atm)
    this.onDeleteConfirmation = confirmed => {
      if (confirmed) {
        this.props.deleteEntry({ issue, section, entry: entry.objectName })
      } else {
        this.debug('delete was cancelled...')
      }
    }
  }

  callDeleteHandler(confirmed) {
    this.onDeleteConfirmation(confirmed)
  }

  renderDialog() {
    return (
      <Dialog open={this.props.dialogActive}>
        <main>
          <h3>Are you sure you want to delete this?</h3>
          <h3>This can NOT be undone!</h3>
        </main>
        <footer>

          <button
            onClick={() => {
              this.props.showDialog(false)
              this.callDeleteHandler(true)
            }}
          >
            Yes
          </button>

          <button
            onClick={() => {
              this.props.showDialog(false)
              this.callDeleteHandler(false)
            }}
          >
            No
          </button>
        </footer>
      </Dialog>
    )
  }

  /**
   * TODO: rename me
   */
  @autobind
  considering() {
    const { section, params } = this.props
    const { issue, section: sectionId } = params

    const sections = section.content.map((entry, i) => {
      const link =
        `/admin/issue/${issue}/section/${sectionId}/entry/${entry.objectName}`
      return (
        <section key={i} className={css.editable}>
          <div>objectName (url endpoint): <b>{entry.objectName}</b></div>
          <div>title: <b>{entry.title}</b></div>
          <Link to={link}>
            <button className={css.button}>Edit</button>
          </Link>
          <button
            className={css.button}
            onClick={() => this.deleteEntry(entry)}
          >
            Delete
          </button>
        </section>
      )
    })

    return <div>{sections}</div>
  }

  @autobind
  activateModal() {
    this.props.openModal(true)
  }

  @autobind
  onChange(key, value) {
    if (key === 'image') {
      const files = value.target.files

      if (files && files[0]) {
        const file = files[0]
        const reader = new FileReader()

        reader.onload = e => {
          this.props.setEditableValue(key, {
            title: file.name,
            src: file.name,
            data: reader.result
          })
        }

        reader.readAsBinaryString(file)
      }

    } else {
      this.props.setEditableValue(key, value)
    }
  }

  @autobind
  submitNew() {
    const { issue, section } = this.props.params

    this.props.submitEditable({
      issue,
      section,
      entry: null
    })
  }

  @autobind
  renderModal() {
    const { editable } = this.props

    return (
      <Modal
        isOpen={this.props.modalActive}
        onRequestClose={() => this.props.openModal(false)}
      >
        {/* objectName is built dynamically */}

        <div className={css.formGroup}>
          <label>title:</label>
          <input
            type="text"
            value={editable.title}
            onChange={e => this.onChange('title', e.target.value)}
          />
        </div>

        <div className={css.formGroup}>
          <label>image:</label>
          <input
            type="file"
            onChange={e => this.onChange('image', e.nativeEvent)}
          />
        </div>

        <button className={css.button} onClick={this.submitNew}>
          Submit
        </button>
      </Modal>
    )
  }

  render() {
    const { section, params } = this.props
    const { issue, section: sectionId } = params

    return (
      <div className={css.Admin}>
        <h1>[Issue: {issue} >> Edit Section] >> {sectionId}</h1>

        <section className={css.editable}>
          <h2>Section Thumb</h2>
          <img src={`/static/images/${section.image.src}`} />
          <br />
          <button
            className={css.button}
            onClick={this.uploadSectionThumb}
          >
            Replace
          </button>
        </section>

        <br />

        <h2>Content:</h2>
        <button
          className={css.button}
          onClick={this.activateModal}
        >
          New
        </button>
        <div>{this.considering()}</div>
        <hr />

        {this.renderDialog()}
        {this.renderModal()}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSection)
