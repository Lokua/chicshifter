import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import cx from 'classnames'

import { uiActions, shallowUpdate, injectLogger } from '@common'
import { Modal } from '@components/Modal'

import css from './ImageModal.scss'

const mapStateToProps = state => ({
  imageModalActive: state.ui.imageModalActive
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

    // imageRef: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    // oneOfType does not seem to work with null
    imageRef: PropTypes.any
  }

  render() {
    if (!this.props.imageRef) {
      return (<span style={{ display: 'none' }} />)
    }

    return (
      <div className={css.ImageModal}>
        <Modal
          isOpen={this.props.imageModalActive}
          onRequestClose={() => this.props.openImageModal(false)}
          styles={{
            content: {
              background: 'black'
            }
          }}
        >
          {(() => {
            const image = this.props.image

            const style = {}
            if (image.rotate) {
              style.transform = `rotate(${image.rotate}deg)`
            }

            let imageClass = 'wide'
            const { width, height } = this.props.imageRef
            if (height > width) {
              imageClass = 'tall'
            }

            return (
              <div className={css.imageContainer}>
                <img
                  ref="modalImage"
                  className={cx(css[imageClass], css.image)}
                  style={style}
                  onClick={() => this.props.openImageModal(true)}
                  {...image}
                />
              </div>
            )
          })()}
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageModal)
