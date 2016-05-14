import React, { PropTypes } from 'react'
import NavLink from './NavLink.jsx'
import css from './Nav.scss'

const Nav = ({ pathName }) => (
  <nav className={css.Nav}>
    <ul>

      <li>
        {pathName !== '/about' && <NavLink to="/about" text="About" />}
      </li>

      <li>
        <NavLink to="/issue/1/letter-from-the-editor" text="S/S 2016" />
      </li>

    </ul>
  </nav>
)

Nav.propTypes = {
  pathName: PropTypes.string.isRequired
}

export default Nav
