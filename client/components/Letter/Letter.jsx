import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Prose } from '@components/Prose'
import actions from './actions'
import css from './Letter.scss'

const mapStateToProps = (state, props) => ({
  issue: props.params.issue,
  letter: state.letter || ''
})

const mapDispatchToProps = dispatch => ({
  fetchLetter: issue => dispatch(actions.fetchLetter(issue))
})

class Letter extends Component {
  static propTypes = {
    letter: PropTypes.string.isRequired,
    fetchLetter: PropTypes.func.isRequired,
    issue: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.fetchLetter(this.props.issue)
  }

  render() {
    return (
      <div className={css.Letter}>
        <Prose text={this.props.letter} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Letter)
