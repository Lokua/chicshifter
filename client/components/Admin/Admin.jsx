import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from './actions'
import css from './style.scss'

const mapStateToProps = state => ({
  issues: state.issues
})

class Admin extends Component {

  static propTypes = {
    issues: PropTypes.array.isRequired
  }

  render() {
    return (
      <div className={css.Admin}>

        <h1>Edit Issue</h1>
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

        <hr />

        <pre className={css.jsonBlob}>
          {JSON.stringify(this.props.issues, null, 2)}
        </pre>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Admin)
