import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import css from './Thumb.scss'

function Thumb({ link, image, caption }) {
  const src = image.url.charAt(0) === '/' ? image.url : `/${image.url}`

  return (
    <figure className={css.Thumb}>
      <Link to={link}>
        <img
          title={image.title}
          alt={image.alt || image.title}
          src={src}
        />
        {caption &&
          <figcaption>
            <h4>{caption}</h4>
          </figcaption>
        }
      </Link>
    </figure>
  )
}

Thumb.propTypes = {
  link: PropTypes.string.isRequired,
  image: PropTypes.shape({
    title: PropTypes.string.isRequired,
    alt: PropTypes.string,
    url: PropTypes.string.isRequired
  }).isRequired,
  caption: PropTypes.string
}

export default Thumb
