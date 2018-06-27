import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const NavLink = ({ to, text, onClick }) => (
  <h4 className="brand">
    <Link to={to}>{text}</Link>
  </h4>
)

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default NavLink
