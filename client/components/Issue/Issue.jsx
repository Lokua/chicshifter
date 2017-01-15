import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { shallowUpdate, injectLogger } from '@common'
import selectors from '@common/selectors'
import { FlippyThumb } from '@components/FlippyThumb'

import css from './Issue.scss'

@connect(state => ({
  issue: selectors.activeIssue(state),
  sections: selectors.sections(state)
}))
@injectLogger
@shallowUpdate
export default class Issue extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
    sections: PropTypes.array.isRequired
  }

  render() {
    const { issue, sections } = this.props
    this.debug(issue, sections)

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

              const link = `/issue/${issue.fields.Number}/${fields.Slug}`
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
