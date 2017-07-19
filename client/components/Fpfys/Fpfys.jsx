import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { injectLogger, shallowUpdate, uiActions } from '@common'
import { IconButton } from '@components/IconButton'
import { Modal } from '@components/Modal'

import Fpfy from './Fpfy.jsx'
import css from './Fpfys.scss'

const mapStateToProps = state => ({
  activeIssueNumber: state.ctx.activeIssueNumber,
  fpfys: state.v2.fpfys.filter(x => {
    return x.fields.Enabled && x.fields.Issue === state.ctx.activeIssueNumber
  }),
  currentFpfy: state.ui.currentFpfy,
  fpfyImageLoading: state.ui.fpfyImageLoading,
  fpfyModalActive: state.ui.fpfyModalActive
})

const mapDispatchToProps = (dispatch, props) => ({
  toggleFpfyImageLoading: bool => (
    dispatch(uiActions.toggleFpfyImageLoading(bool))
  ),
  prev: () => dispatch(uiActions.getPreviousFpfy()),
  next: count => dispatch(uiActions.getNextFpfy(count)),
  openFpfyModal: open => dispatch(uiActions.openFpfyModal(open))
})

@injectLogger
@shallowUpdate
class Fpfys extends Component {
  static propTypes = {
    fpfys: PropTypes.array.isRequired,
    currentFpfy: PropTypes.number.isRequired,
    fpfyImageLoading: PropTypes.bool.isRequired,
    toggleFpfyImageLoading: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    fpfyModalActive: PropTypes.bool.isRequired,
    openFpfyModal: PropTypes.func.isRequired
  }

  render() {
    const {
      fpfys,
      prev,
      next,
      currentFpfy,
      fpfyImageLoading,
      toggleFpfyImageLoading,
      fpfyModalActive,
      openFpfyModal
    } = this.props

    const prevDisabled = currentFpfy === 0
    const nextDisabled = currentFpfy === fpfys.length-1

    if (!fpfys[currentFpfy]) return null

    return (
      <div className={css.Fpfys}>
        <div className={css.overlay} />

        <Modal
          isOpen={fpfyModalActive}
          onRequestClose={() => openFpfyModal(false)}
        >
          <div className={css.modalContent}>
            <h1>{fpfys[currentFpfy].fields.Response[0]}!</h1>
            <div className={css.imageContainer}>
              <img
                src={
                  fpfys[currentFpfy].fields.Response[0] === 'Faux Yeah'
                    ? `/static/images/FauxYea_JacquelineAlcantara__512.jpg`
                    : `/static/images/FauxPas_JacquelineAlcantara__512.jpg`
                }
              />
            </div>
            <h2>{fpfys[currentFpfy].fields.ResponseText}</h2>
          </div>
        </Modal>

        <div className={css.fpfysInner}>
          <header>
            <h2 className={css.title}>Faux Pas or Faux Yeah?</h2>
          </header>

          <main>
            <section className={css.paws}>
              <div className={css.paw}>
                <img
                  onClick={() => {
                    openFpfyModal(true)
                  }}
                  src={`/static/images/FauxPas_JacquelineAlcantara__512.jpg`}
                  title="Vote Pas"
                  alt="Faux Pas Paw Image"
                />
              </div>
              <div className={css.paw}>
                <img
                  onClick={() => {
                    openFpfyModal(true)
                  }}
                  src={`/static/images/FauxYea_JacquelineAlcantara__512.jpg`}
                  title="Vote yea"
                  alt="Faux Yeah Paw Image"
                />
              </div>
            </section>

            <section className={css.fpfys}>
              {fpfys &&
                <Fpfy
                  fpfy={fpfys[currentFpfy]}
                  fpfyImageLoading={fpfyImageLoading}
                  toggleFpfyImageLoading={toggleFpfyImageLoading}
                />
              }
            </section>
          </main>

          <footer className={css.pagination}>
            <IconButton
              i="angle-left"
              className={classNames(css.iconButton, {
                [css.disabled]: prevDisabled
              })}
              textAlign="right"
              tooltip="previous"
              onClick={() => {
                if (prevDisabled) return
                toggleFpfyImageLoading(true)
                prev()
              }}
            />
            <IconButton
              i="angle-right"
              className={classNames(css.iconButton, {
                [css.disabled]: nextDisabled
              })}
              textAlign="left"
              tooltip="next"
              onClick={() => {
                if (nextDisabled) return
                toggleFpfyImageLoading(true)
                next(fpfys.length)
              }}
            />
          </footer>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fpfys)
