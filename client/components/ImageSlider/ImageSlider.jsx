import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import cx from 'classnames'

import { uiActions, shallowUpdate, injectLogger } from '@common'
import { IconButton } from '@components/IconButton'
import { ImageModal } from '@components/ImageModal'

import css from './ImageSlider.scss'

const mapStateToProps = (state, props) => ({
  index: state.ui.imageSliders[props.id] &&
    state.ui.imageSliders[props.id].index || props.index,
  imageModalActive: state.ui.imageModalActive,
  imageClass: state.ui.imageClass
})

const mapDispatchToProps = (dispatch, props) => {
  const { id } = props
  return {
    initImageSlider: () => dispatch(uiActions.initImageSlider(id)),
    incImageIndex: tail => dispatch(uiActions.incImageIndex(id, tail)),
    decImageIndex: () => dispatch(uiActions.decImageIndex(id)),
    setImageIndex: index => dispatch(uiActions.setImageIndex(id, index)),
    openImageModal: open => dispatch(uiActions.openImageModal(open)),
    setImageClass: imageClass => dispatch(uiActions.setImageClass(imageClass))
  }
}

@injectLogger
@shallowUpdate
class ImageSlider extends Component {

  static defaultProps = {
    index: 0
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number,
    images: PropTypes.array.isRequired,
    initImageSlider: PropTypes.func.isRequired,
    incImageIndex: PropTypes.func.isRequired,
    decImageIndex: PropTypes.func.isRequired,
    setImageIndex: PropTypes.func.isRequired,
    imageModalActive: PropTypes.bool.isRequired,
    openImageModal: PropTypes.func.isRequired,
    imageClass: PropTypes.string.isRequired,
    setImageClass: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.initImageSlider(this.props.id, this.props.index)
  }

  getCurrentImage() {
    return this.props.images[this.props.index]
  }

  @autobind
  hasCaption() {
    const image = this.getCurrentImage()
    return image && image.hasOwnProperty('caption')
  }

  @autobind
  getCaption() {
    const image = this.getCurrentImage()
    return image && image.caption
  }

  @autobind
  renderCredits() {
    const image = this.getCurrentImage()
    if (image && image.credits && image.credits.length) {
      return (
        <ul className={css.credits}>
          {image.credits.map((credit, i) => (
            <li key={i}>{credit.type}: {credit.person}</li>
          ))}
        </ul>
      )
    }
  }

  render() {
    const { images, index,
      incImageIndex, decImageIndex, setImageIndex } = this.props
    const tailIndex = images.length - 1

    return (
      <div className={css.ImageSlider}>

        {this.activeImageNode && this.props.imageModalActive &&
          <ImageModal
            image={this.getCurrentImage()}
            imageRef={this.activeImageNode}
          />
        }

        <section className={css.main}>
          <div className={css.navButtonContainer}>
            <IconButton
              i="angle-left"
              className={cx(css.navButton, {
                [css.disabled]: index === 0
              })}
              onClick={() => decImageIndex()}
            />
          </div>

          <div className={css.imageContainer} ref="imageContainer">

            <div className={css.overlay}>Click to enlarge</div>

            {images.map((image, i) => {
              const isActive = i === index
              const style = {}

              if (image.rotate) {
                style.transform = `rotate(${image.rotate}deg)`
              }

              return (
                <img
                  key={i}
                  ref={node => {
                    if (isActive) this.activeImageNode = node
                  }}
                  className={cx(css.image, {
                    [css.active]: isActive
                  })}
                  style={style}
                  onClick={() => this.props.openImageModal(true)}
                  {...image}
                />
              )
            })}
          </div>

          <div className={css.navButtonContainer}>
            <IconButton
              i="angle-right"
              className={cx(css.navButton, {
                [css.disabled]: index === tailIndex
              })}
              onClick={() => incImageIndex(tailIndex)}
            />
          </div>
        </section>

        <section className={css.meta}>
          <div>{index + 1} / {tailIndex + 1}</div>
          {this.hasCaption() &&
            <div className={css.caption}>{this.getCaption()}</div>
          }
          {this.renderCredits()}
        </section>

        <section className={css.thumbs}>
          {images.map((image, i) => {

            const style = {
              backgroundImage: `url('${image.src}')`
            }

            if (image.rotate) {
              style.transform = `rotate(${image.rotate}deg)`
            }

            return (
              <div
                key={i}
                className={cx(css.thumb, {
                  [css.active]: i === index
                })}
                style={style}
                onClick={() => setImageIndex(i)}
              />
            )
          })}
        </section>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageSlider)
