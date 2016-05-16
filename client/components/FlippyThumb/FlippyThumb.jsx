import React, { Component, PropTypes } from 'react'
import css from './FlippyThumb.scss'

export default class FlippyThumb extends Component {

  static propTypes = {
    front: PropTypes.any,
    back: PropTypes.any,
    backgroundImage: PropTypes.string
  }

  render() {
    return (
      <div className={css.FlippyThumb}>
        <section
          className={css.front}
          style={{ backgroundImage: `url('${this.props.backgroundImage}')` }}
        >
          {this.props.front}
        </section>

        <section className={css.back}>
          <div className={css.backText}>{this.props.back}</div>
        </section>
      </div>
    )
  }
}
