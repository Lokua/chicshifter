/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import cx from 'classnames'

import { uiActions, shallowUpdate, injectLogger } from '@common'
import { Modal } from '@components/Modal'

import css from './ImageModal.scss'

const mapStateToProps = state => ({
  imageModalActive: state.ui.imageModalActive,
  image: state.ui.imageModalImage
})

const mapDispatchToProps = (dispatch, props) => ({
  openImageModal: open => dispatch(uiActions.openImageModal(open))
})

@shallowUpdate
@injectLogger
class ImageModal extends Component {

  static propTypes = {
    image: PropTypes.object.isRequired,
    imageModalActive: PropTypes.bool.isRequired,
    openImageModal: PropTypes.func.isRequired,
    imageRef: PropTypes.any
  }

  renderImage() {
    const { image } = this.props

    if (image.rotate) {
      style.transform = `rotate(${image.rotate}deg)`
    }

    return (
      <div className={css.imageContainer}>
        <div
          className={css.image}
          ref="modalImage"
          style={{ backgroundImage: `url('${image.src}')` }}
          onClick={() => this.props.openImageModal(true)}
        />
      </div>
    )
  }

  render() {
    if (!this.props.imageRef) {
      return (<span style={{ display: 'none' }} />)
    }

    return (
      <div className={css.ImageModal} ref="modalContainer">
        <Modal
          isOpen={this.props.imageModalActive}
          onRequestClose={() => this.props.openImageModal(false)}
          styles={{ content: { background: 'black' } }}
        >
          {::this.renderImage()}
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageModal)
