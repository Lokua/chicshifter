import React from 'react'
import { Link } from 'react-router'
import css from './Footer.scss'

const Footer = () => (
  <footer className={`Footer ${css.Footer}`}>
    <h3 className={css.copyright}>
      &copy; 2016 Ana Sekler
    </h3>
  </footer>
)

export default Footer
