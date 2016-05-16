import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { shallowUpdate } from '@common'
import { FlippyThumb } from '@components/FlippyThumb'

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
        <div className={css.issueInner}>
          <ul className={css.thumbs}>
            {Object.keys(issue.sections).map(key => {

              const front = (
                <div className={css.sectionLabelContainer}>
                  <div className={css.sectionLabelOverlay} />
                  <div className={css.sectionLabel}>
                    <h2>{issue.sections[key].name}</h2>
                  </div>
                </div>
              )

              const back = <h3>{issue.sections[key].caption}</h3>

              const link = `issue/${issue.id}/${issue.sections[key].objectName}`

              return (
                <li key={key}>
                  <Link to={link}>
                    <FlippyThumb
                      front={front}
                      back={back}
                      backgroundImage={issue.sections[key].image.src}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Issue)
