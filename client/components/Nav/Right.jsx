import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { getSeasonAbbreviation } from '@common/util'
import selectors from '@common/selectors'
import NavLink from './NavLink.jsx'
import css from './Nav.scss'

@connect(state => ({
  issues: selectors.issues(state)
}))
export default class Right extends Component {
  static propTypes = {
    issues: PropTypes.array.isRequired
  }

  onClick(e) {
    e.preventDefault()
  }

  render() {
    return (
      <nav className={`${css.Nav} ${css.Right}`}>
        <ul>
          <li className="a">
            <h4 className="brand">Issues</h4>
          </li>
          {this.props.issues.map(({ id, createdTime, fields }) => {
            const text = getSeasonAbbreviation(fields.Season)

            return (
              <li key={id}>
                <NavLink
                  to={`/issue/${fields.Number}`}
                  text={`${text} ${fields.Year}`}
                  onClick={this.onClick}
                />
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}
