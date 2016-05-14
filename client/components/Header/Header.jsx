import React, { PropTypes } from 'react'
import cx from 'classnames'
import { Link } from 'react-router'
import { Nav } from '@components/Nav'

import css from './Header.scss'

const Header = props => (
  <header className={`Header ${css.Header}`}>

    <div className={css.nav}>
      <Nav pathName={props.pathName} />
    </div>

    <section className={css.bannerContainer}>

      <h1 className={cx(css.banner, "brand")}>
        <Link to="/">Chic Shifter</Link>
      </h1>

      <aside className={css.caption}>
        <h2 className={cx(css.captionText, "brand")}>
          a digital fashion journal
        </h2>
      </aside>
    </section>

    <h4 className={cx(css.navLink, css.dummy, "brand")}></h4>

  </header>
)

Header.propTypes = {
  pathName: PropTypes.string.isRequired
}

export default Header
