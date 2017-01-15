import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import selectors from '@common/selectors'
import { Prose } from '@components/Prose'
import css from './Letter.scss'

@connect((state, props) => {
  const issueNumber = parseInt(props.routeParams.issue)

  return {
    letter: selectors.issues(state).find(issue => (
      issue.fields.Number === issueNumber
    )).fields.EditorLetterHTML
  }
})
export default class Letter extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired,
    routeParams: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className={css.Letter}>
        <Prose text={this.props.letter} />
      </div>
    )
  }
}
