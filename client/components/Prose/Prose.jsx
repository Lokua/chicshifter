import React, { PropTypes } from 'react'
import classNames from 'classnames'

const Prose = ({ classes, text }) => (
  <div className="Prose">
    <main
      className={classNames("markdown", classes)}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  </div>
)

Prose.propTypes = {
  classes: PropTypes.any,
  text: PropTypes.string.isRequired
}

export default Prose
