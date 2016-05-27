import React, { PropTypes } from 'react'
import css from './Button.scss'

const Button = ({ className, onClick, text }) => (
  <button className={`${css.Button} ${className}`} onClick={onClick}>
    {text}
  </button>
)

Button.defaultProps = {
  className: ''
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  text: PropTypes.string.isRequired
}

export default Button
