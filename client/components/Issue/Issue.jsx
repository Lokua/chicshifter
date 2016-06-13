import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { shallowUpdate } from '@common'
import { FlippyThumb } from '@components/FlippyThumb'

import actions from './actions'
import { getLatestIssue } from './selectors'
import css from './Issue.scss'

const mapStateToProps = state => ({
  issue: getLatestIssue(state),
  v2: state.issues[0].v2.issues[0],
  sections: state.issues[0].v2.sections
})

@shallowUpdate
class Issue extends Component {

  static propTypes = {
    issue: PropTypes.object,
    v2: PropTypes.object,
    sections: PropTypes.array.isRequired
  }

  render() {
    const { /*issue, */v2, sections } = this.props

    return (
      <div className="Issue">
        <div className={css.issueInner}>
          <ul className={css.thumbs}>
            {sections.map((section, i) => {
              const { fields } = section

              const front = (
                <div className={css.sectionLabelContainer}>
                  <div className={css.sectionLabelOverlay} />
                  <div className={css.sectionLabel}>
                    <h2>{fields.Name}</h2>
                  </div>
                </div>
              )

              const back = <h3>{fields.Caption}</h3>

              const link = `issue/${v2.fields.Number}/${fields.Slug}`
              const backgroundImage = fields.Image[0].thumbnails.large.url

              return (
                <li key={i}>
                  <Link to={link}>
                    <FlippyThumb
                      front={front}
                      back={back}
                      backgroundImage={backgroundImage}
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
