import React, { Component, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import { injectLogger } from '@common'

import css from './Dialog.scss'

@injectLogger
export default class Dialog extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.refs.dialog.showModal()
    } else {
      try {
        this.refs.dialog.close()
      } catch (ignore) {/**/}
    }
  }

  render() {
    return (
      <div className={css.Dialog}>
        <dialog ref="dialog">
          {this.props.children}
        </dialog>
      </div>
    )
  }
}
