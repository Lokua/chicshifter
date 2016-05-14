import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { shallowUpdate, uiActions } from '@common'
import { IconButton } from '@components/IconButton'
import { Modal } from '@components/Modal'

import actions from './actions'
import Fpfy from './Fpfy.jsx'
import css from './Fpfys.scss'

const mapStateToProps = state => ({
  fpfys: state.fpfys.filter(fpfy => !fpfy.disabled),
  currentFpfy: state.ui.currentFpfy,
  fpfyImageLoading: state.ui.fpfyImageLoading,
  fpfyModalActive: state.ui.fpfyModalActive
})

const mapDispatchToProps = (dispatch, props) => ({
  toggleFpfyImageLoading: bool =>
    dispatch(uiActions.toggleFpfyImageLoading(bool)),
  prev: () => dispatch(uiActions.getPreviousFpfy()),
  next: count => dispatch(uiActions.getNextFpfy(count)),
  postFpfyVote: (fpfyId, vote) => dispatch(actions.postFpfyVote(fpfyId, vote)),
  openFpfyModal: open => dispatch(uiActions.openFpfyModal(open))
})

@shallowUpdate
class Fpfys extends Component {

  static propTypes = {
    fpfys: PropTypes.array.isRequired,
    currentFpfy: PropTypes.number.isRequired,
    fpfyImageLoading: PropTypes.bool.isRequired,
    toggleFpfyImageLoading: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    postFpfyVote: PropTypes.func.isRequired,
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
      // postFpfyVote,
      fpfyModalActive,
      openFpfyModal
    } = this.props

    const prevDisabled = currentFpfy === 0
    const nextDisabled = currentFpfy === fpfys.length-1

    return (
      <div className={css.Fpfys}>
        <div className={css.overlay} />

        <Modal
          isOpen={fpfyModalActive}
          onRequestClose={() => openFpfyModal(false)}
        >
          <div className={css.modalContent}>
            <h1>{fpfys[currentFpfy].response.type}!</h1>
            <div className={css.imageContainer}>
              <img
                src={
                  fpfys[currentFpfy].response.type === 'Faux Yeah'
                    ? `/images/FauxYea_JacquelineAlcantara.jpg`
                    : `/images/FauxPas_JacquelineAlcantara.jpg`
                }
              />
            </div>
            <h2>{fpfys[currentFpfy].response.text}</h2>
          </div>
        </Modal>

        <div className={css.fpfysInner}>
          <header>
            <h2 className={css.title}>Faux Pas or Faux Yea?</h2>
          </header>

          <main>
            <section className={css.paws}>
              <div className={css.paw}>
                <img
                  onClick={() => {
                    // postFpfyVote(fpfys[currentFpfy].id, false)
                    openFpfyModal(true)
                  }}
                  src={`/images/FauxPas_JacquelineAlcantara.jpg`}
                  title="Vote Pas"
                  alt="Faux Pas Paw Image"
                />
              </div>
              <div className={css.paw}>
                <img
                  onClick={() => {
                    // postFpfyVote(fpfys[currentFpfy].id, true)
                    openFpfyModal(true)
                  }}
                  src={`/images/FauxYea_JacquelineAlcantara.jpg`}
                  title="Vote yea"
                  alt="Faux Yeah Paw Image"
                />
              </div>
            </section>

            <section className={css.fpfys}>
              {fpfys &&
                <Fpfy
                  {...fpfys[currentFpfy]}
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