import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import { shallowUpdate } from '@common'
import { Thumb } from '@components/Thumb'

import actions from './actions'
import { getLatestIssue } from './selectors'
import css from './Issue.scss'

const mapStateToProps = state => ({
  issue: getLatestIssue(state)
})

@shallowUpdate
class Issue extends Component {

  static propTypes = {
    issue: PropTypes.object,
  }

  render() {
    const { issue } = this.props

    return (
      <div className="Issue">
        {/*<div className={css.overlay} />*/}
        <div className={css.issueInner}>
          <h2 className={css.title}>{issue.season} {issue.year}</h2>
          <ul className={css.thumbs}>
            {Object.keys(issue.sections).map(key => (
              <li key={key}>
                <Thumb
                  link={`issue/${issue.id}/${issue.sections[key].objectName}`}
                  image={issue.sections[key].image}
                  caption={issue.sections[key].name}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Issue)
