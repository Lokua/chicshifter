import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { injectLogger, getSeasonAbbreviation } from '@common'
import selectors from '@common/selectors'
import NavLink from './NavLink.jsx'
import css from './Nav.scss'

@connect(state => ({
  activeIssueNumber: selectors.activeIssueNumber(state),
  activeIssue: selectors.activeIssue(state),
  pathname: selectors.pathname(state)
}))
@injectLogger
export default class Left extends Component {
  static propTypes = {
    activeIssueNumber: PropTypes.number.isRequired,
    activeIssue: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired
  }

  render() {
    const { activeIssue, activeIssueNumber, pathname } = this.props
    const { createdTime, fields } = activeIssue
    const name = getSeasonAbbreviation(fields.Season)
    // this.debug(`activeIssue:`, activeIssue)

    return (
      <nav className={css.Nav}>
        <ul>
          <li>
            {pathname !== `/about` && <NavLink to="/about" text="About" />}
          </li>
          <li>
            <NavLink
              to={`/issue/${activeIssueNumber}/letter-from-the-editor`}
              text={`${name} ${createdTime.slice(0, 4)}`}
            />
          </li>
        </ul>
      </nav>
    )
  }
}
