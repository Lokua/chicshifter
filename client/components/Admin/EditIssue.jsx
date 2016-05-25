import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import map from 'lodash.map'

import { Slug } from '@components/Slug'

import css from './style.scss'

const mapStateToProps = (state, props) => ({
  issue: state.issues[props.params.issue - 1]
})

class EditIssue extends Component {

  static propTypes = {
    issue: PropTypes.object.isRequired
  }

  render() {
    const { issue } = this.props
    const slug = [
      { href: '/admin', text: 'admin' },
      { href: `/admin/issue/${issue.id}`, text: `issue ${issue.id}` },
    ]

    return (
      <div className={css.Admin}>
        <Slug path={slug} />

        <ul>
          {map(this.props.issue.sections, (section, id) => (
            <li key={id}>
              <Link
                to={`/admin/issue/${issue.id}/section/${section.objectName}`}
              >
                <button className={css.button}>{section.objectName}</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps)(EditIssue)
