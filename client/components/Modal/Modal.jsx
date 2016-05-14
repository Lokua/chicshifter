import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { shallowUpdate } from '@common'
import { IconButton } from '@components/IconButton'
import css from './Modal.scss'
import ReactModal from 'react-modal'

@shallowUpdate
export default class Modal extends Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.75)'
          },
          content: {
            borderRadius: 0,
            border: '1px solid #888',
            overflow: 'hidden'
          }
        }}
      >

        <div className={css.Modal}>
          <header className={css.header}>
            <IconButton
              i="close"
              className={classNames(css.close)}
              textAlign="right"
              onClick={this.props.onRequestClose}
            />
          </header>

          <main className={css.main}>
            {this.props.children}
          </main>

          <footer className={css.footer}>
          </footer>
        </div>

      </ReactModal>
    )
  }
}
