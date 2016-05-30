import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'

import { Slug } from '@components/Slug'

import actions from './actions'
import css from './style.scss'

const mapStateToProps = (state, props) => ({
  issues: state.issues,
  isAuthenticated: state.admin.isAuthenticated,
  history: props.history
})

class Admin extends Component {

  static propTypes = {
    issues: PropTypes.array.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className={css.Admin}>
        {this.props.isAuthenticated &&
          <div>
            <Slug path={[{ href: '/admin', text: 'admin' }]} />
            <ul>
              {this.props.issues.map(issue => (
                <li key={issue.id}>
                  <Link to={`/admin/issue/${issue.id}`}>
                    <button className={css.button}>
                      {issue.id}: {issue.season} {issue.year}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Admin))
