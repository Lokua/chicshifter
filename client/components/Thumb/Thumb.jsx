import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import css from './Thumb.scss'

function Thumb({ link, image, caption, imageType }) {
  const src = image.src.charAt(0) === '/' ? image.src : `/${image.src}`
  let imageEl

  if (imageType === 'image') {
    imageEl = (
      <img
        title={image.title}
        alt={image.alt || image.title}
        src={src}
      />
    )

  } else {
    imageEl = (
      <div
        title={image.title}
        alt={image.alt || image.title}
        style={{
          backgroundImage: `url('${src}')`
        }}
      />
    )
  }

  return (
    <figure className={css.Thumb}>
      <Link to={link}>
        {caption &&
          <figcaption>
            <h4>{caption}</h4>
          </figcaption>
        }
        {imageEl}
      </Link>
    </figure>
  )
}

Thumb.defaultProps = {
  imageType: 'image'
}

Thumb.propTypes = {
  link: PropTypes.string.isRequired,
  image: PropTypes.shape({
    title: PropTypes.string.isRequired,
    alt: PropTypes.string,
    src: PropTypes.string.isRequired
  }).isRequired,
  caption: PropTypes.string,
  imageType: PropTypes.oneOf(['image', 'background'])
}

export default Thumb
