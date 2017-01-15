import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { injectLogger } from '@common'
import selectors from '@common/selectors'
import { actions } from '@common/ctx'
import { Loading } from '@components/Loading'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import css from './App.scss'

@connect(
  state => ({
    latestIssue: selectors.latestIssue(state),
    activeIssueNumber: selectors.activeIssueNumber(state)
  }),
  dispatch => bindActionCreators(actions.creators, dispatch)
)
@injectLogger
export default class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    latestIssue: PropTypes.object.isRequired,
    activeIssueNumber: PropTypes.number.isRequired,
    setActiveIssueNumber: PropTypes.func.isRequired,
    setPathname: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const {
      setActiveIssueNumber,
      setPathname,
      latestIssue,
      activeIssueNumber
    } = this.props

    document.body.style.display = `block`
    this.debug(this.props, this.context)

    this.context.router.listen(({ pathname }) => {
      const p = pathname.startsWith(`/`) ? pathname : `/${pathname}`

      if ((p === `/` || /(about|home)/.test(p)) &&
          latestIssue.fields.Number !== activeIssueNumber) {
        setActiveIssueNumber(latestIssue.fields.Number)

      } else if (p.startsWith(`/issue`)) {
        const match = /\/issue\/(\d+).*/.exec(p)
        if (match) setActiveIssueNumber(match[1])

      } else {
        this.warn(`Could not detect issue number for pathname`, p)
      }

      setPathname(p)
    })
  }

  render() {
    if (this.props.activeIssueNumber === -1) {
      return (
        <div style={{ marginTop: `64px` }}>
          <Loading loading size={[`100%`, `auto`]} />
        </div>
      )
    }

    return (
      <div className={css.App}>
        <div className={css.backgroundImage} />
        <div className={css.site}>
          <Header pathName={this.props.location.pathname} />
          <main className={css.main}>
            {this.props.children}
          </main>
          <Footer />
        </div>
      </div>
    )
  }
}
