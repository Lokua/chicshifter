import React, { Component, PropTypes } from 'react'
import css from './Fpfy.scss'

// addresses a bug where first image load does not trigger
let cherry = true

export default class Fpfy extends Component {

  static propTypes = {
    fpfy: PropTypes.object.isRequired,
    fpfyImageLoading: PropTypes.bool.isRequired,
    toggleFpfyImageLoading: PropTypes.func.isRequired
  }

  componentDidMount() {
    if (cherry) {
      setTimeout(() => this.props.toggleFpfyImageLoading(false), 100)
      cherry = false
    }
  }

  render() {
    const { fields } = this.props.fpfy
    const image = fields.Image[0]

    return (
      <figure className={css.Fpfy}>
        <h3 className={css.title}>{fields.Name}</h3>
        <div
          className={css.imageContainer}
          style={{ paddingBottom: '8px' }}
        >
          <img
            style={{ opacity: +!this.props.fpfyImageLoading }}
            onLoad={() => {
              setTimeout(() => this.props.toggleFpfyImageLoading(false))
            }}
            src={image.url}
            title={image.filename || 'Faux Pas or Paux Yeah?'}
            alt={image.filename || 'Faux Pas or Paux Yeah?'}
          />
        </div>
      </figure>
    )
  }
}
