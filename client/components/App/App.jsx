import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { actions as adminActions } from '@components/Admin'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import css from './App.scss'

const mapStateToProps = state => ({
  isAuthenticated: state.admin.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(adminActions.logout())
})

class App extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired
  }

  componentDidMount() {
    document.body.style.display = 'block'
  }

  render() {
    return (
      <div className={css.App}>
        <div className={css.backgroundImage} />
        <div className={css.site}>
          <Header pathName={this.props.location.pathname} />
          {this.props.isAuthenticated &&
            <button
              onClick={this.props.logout}
              className={css.logout}
            >
              LOGOUT
            </button>
          }
          <main className={css.main}>
            {this.props.children}
          </main>
          <Footer />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
