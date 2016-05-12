import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import { uiActions, shallowUpdate, injectLogger } from '@common'
import css from './ImageSlider.scss'

const mapStateToProps = (state, props) => ({
  index: state.ui.imageSliders[props.id] &&
    state.ui.imageSliders[props.id].index || props.index
})

const mapDispatchToProps = (dispatch, props) => {
  const { id } = props
  return {
    initImageSlider: () => dispatch(uiActions.initImageSlider(id)),
    incImageIndex: tail => dispatch(uiActions.incImageIndex(id, tail)),
    decImageIndex: () => dispatch(uiActions.decImageIndex(id)),
    setImageIndex: index => dispatch(uiActions.setImageIndex(id, index))
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
    setImageIndex: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.initImageSlider(this.props.id, this.props.index)
  }

  render() {
    const { images, index,
      incImageIndex, decImageIndex, setImageIndex } = this.props
    const tailIndex = images.length - 1

    return (
      <div className={css.ImageSlider}>

        <section className={css.main}>
          <button className={css.navButton} onClick={() => decImageIndex()}>
            <div
              className={
                classNames(css.arrow, css.arrowLeft, {
                  [css.disabled]: index === 0
                })
              }
            />
          </button>

          <div className={css.imageContainer} ref="imageContainer">
            {images.map((image, i) => {
              const isActive = i === index

              return (
                <img
                  key={i}
                  className={classNames(css.image, {
                    [css.active]: isActive
                  })}
                  {...image}
                />
              )
            })}
          </div>

          <button
            className={css.navButton}
            onClick={() => incImageIndex(tailIndex)}
          >
            <div
              className={
                classNames(css.arrow, css.arrowRight, {
                  [css.disabled]: index === tailIndex
                })
              }
            />
          </button>
        </section>

        <section className={css.meta}>
          {index + 1} / {tailIndex + 1}
        </section>

        <section className={css.thumbs}>
          {images.map((image, i) => (
            <div
              key={i}
              className={classNames(css.thumb, {
                [css.active]: i === index
              })}
              style={{ backgroundImage: `url(${image.src})` }}
              onClick={() => setImageIndex(i)}
            />
          ))}
        </section>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageSlider)
