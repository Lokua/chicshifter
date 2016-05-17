import React, { Component, PropTypes } from 'react'
import css from './Fpfy.scss'

// addresses a bug where first image load does not trigger
let cherry = true

export default class Fpfy extends Component {

  static propTypes = {
    name: PropTypes.string,
    image: PropTypes.object,
    text: PropTypes.string,
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

    const [name, ext] = this.props.image.url.split('.')
    const url = `${name}__1024.${ext}`

    return (
      <figure className={css.Fpfy}>
        <h3 className={css.title}>{this.props.name}</h3>
        <div
          className={css.imageContainer}
          style={{ paddingBottom: '8px' }}
        >
          <img
            style={{ opacity: +!this.props.fpfyImageLoading }}
            onLoad={() => {
              setTimeout(() => this.props.toggleFpfyImageLoading(false))
            }}
            src={`/static/images/processed/fpfys/${url}`}
            title={this.props.image.name || 'Faux Pas or Paux Yeah?'}
            alt={this.props.image.name || 'Faux Pas or Paux Yeah?'}
          />
        </div>
        {/*<figcaption>{this.props.text}</figcaption>*/}
      </figure>
    )
  }
}
