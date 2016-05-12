import React, { Component, PropTypes } from 'react'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import css from './App.scss'

class App extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired
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
          <main className={css.main}>
            {this.props.children}
          </main>
          <Footer />
        </div>
      </div>
    )
  }
}

export default App
