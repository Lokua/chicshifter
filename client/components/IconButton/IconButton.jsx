import React, { PropTypes } from 'react'
import classNames from 'classnames'
import css from './IconButton.scss'

const IconButton = ({ i, display, textAlign, onClick, className, tooltip }) => (
  <button
    className={classNames(css.IconButton, className)}
    style={{ display, textAlign }}
    onClick={onClick}
    title={tooltip}
  >
    <div className={`icon i-${i}`} />
  </button>
)

IconButton.defaultProps = {
  onClick: () => {},
  display: 'block',
  textAlign: 'left',
  tooltip: ''
}

IconButton.propTypes = {
  onClick: PropTypes.func,
  display: PropTypes.string,
  textAlign: PropTypes.string,
  i: PropTypes.string.isRequired,
  className: PropTypes.any,
  tooltip: PropTypes.string
}

export default IconButton
