import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Prose } from '@components/Prose'
import css from './Letter.scss'

const mapStateToProps = (state, props) => ({
  letter: state.v2.issues[props.params.issue-1].fields.EditorLetterHTML
})

class Letter extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired
  }

  render() {
    return (
      <div className={css.Letter}>
        <Prose text={this.props.letter} />
      </div>
    )
  }
}

export default connect(mapStateToProps)(Letter)
