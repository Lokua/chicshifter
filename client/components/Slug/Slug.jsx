import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { shallowUpdate, injectLogger } from '@common'
import css from './Slug.scss'

@shallowUpdate
@injectLogger
export default class Slug extends Component {

  static propTypes = {
    path: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    })).isRequired
  }

  render() {
    const { path } = this.props

    return (
      <div className={css.Slug}>
        {path.map((p, i) => (
          <span key={i}>
            <Link to={p.href}>{p.text}</Link>
            {i !== path.length-1 &&
              <span className={css.separator}> &gt; </span>
            }
          </span>
        ))}
      </div>
    )
  }
}
