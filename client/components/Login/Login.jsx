import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { injectLogger } from '@common'
import { actions } from '@components/Admin'
import { Button } from '@components/Button'
import css from './Login.scss'

const mapStateToProps = state => ({
  isAuthenticated: state.admin.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(actions.login(username, password))
})

@injectLogger
class Login extends Component {

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  }

  render() {
    const { login } = this.props

    return (
      <div className={css.Login}>

        <h1>Login</h1>

        <div className={css.inputGroup}>
          <label>username:</label>
          <input type="text" defaultValue="" ref="username" />
        </div>

        <div className={css.inputGroup}>
          <label>password:</label>
          <input type="password" defaultValue="" ref="password" />
        </div>

        <Button
          className={css.submit}
          onClick={() =>
            login(this.refs.username.value, this.refs.password.value)
              .then(() => {
                if (this.props.isAuthenticated) {
                  this.props.router.push({ pathname: '/admin' })
                } else {
                  console.log('what the fuck...')
                }
              })
          }
          text="Submit"
        />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
