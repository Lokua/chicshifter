import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { shallowUpdate, randomBoolean, uiActions } from '@common'
import { IconButton } from '@components/IconButton'

import actions from './actions'
import Fpfy from './Fpfy.jsx'
import css from './Fpfys.scss'

const mapStateToProps = state => ({
  fpfys: state.fpfys,
  currentFpfy: state.ui.currentFpfy,
  fpfyImageLoading: state.ui.fpfyImageLoading
})

const mapDispatchToProps = (dispatch, props) => ({
  toggleFpfyImageLoading: bool =>
    dispatch(uiActions.toggleFpfyImageLoading(bool)),
  prev: () => dispatch(uiActions.getPreviousFpfy()),
  next: count => dispatch(uiActions.getNextFpfy(count)),
  postFpfyVote: (fpfyId, vote) => dispatch(actions.postFpfyVote(fpfyId, vote))
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
    postFpfyVote: PropTypes.func.isRequired
  }

  render() {
    const { fpfys, prev, next, currentFpfy, fpfyImageLoading,
      toggleFpfyImageLoading, postFpfyVote } = this.props

    const prevDisabled = currentFpfy === 0
    const nextDisabled = currentFpfy === fpfys.length-1

    return (
      <div className={css.Fpfys}>
        <div className={css.overlay} />
        <div className={css.fpfysInner}>
          <header>
            <h2 className={css.title}>
              Faux Paw or Faux Yea?
              {/*Faux {`Pa${randomBoolean() ? 's' : 'w'}`} or Faux Yea?*/}
            </h2>
          </header>

          <main>
            <section className={css.paws}>
              <div className={css.paw}>
                <img
                  onClick={() => postFpfyVote(fpfys[currentFpfy].id, false)}
                  src={`/images/FauxPas_JacquelineAlcantara.jpg`}
                  title="Vote Pas"
                  alt="Faux Pas Paw Image"
                />
              </div>
              <div className={css.paw}>
                <img
                  onClick={() => postFpfyVote(fpfys[currentFpfy].id, true)}
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
