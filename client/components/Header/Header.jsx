import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import css from './Header.scss'

const Header = props => (
  <header className={`Header ${css.Header}`}>

    <h4 className={css.navLink}>
      {props.pathName !== '/about' && <Link to="/about">About</Link>}
    </h4>

    <section className={css.bannerContainer}>
      <h1 className={css.banner}>
        <Link to="/">Chic Shifter</Link>
      </h1>
      <aside className={css.caption}>
        <h2 className={css.captionText}>
          a digital fashion journal with an altered hem
        </h2>
      </aside>
    </section>

    <h4 className={`${css.navLink} ${css.dummy}`}></h4>

  </header>
)

Header.propTypes = {
  pathName: PropTypes.string.isRequired
}

export default Header
