import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// eslint-disable-next-line no-unused-vars
import { shallowUpdate, randomBoolean, uiActions } from '@common'
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
              <img
                onClick={() => postFpfyVote(fpfys[currentFpfy].id, false)}
                src={`/images/FauxPas_JacquelineAlcantara.jpg`}
                title="Vote Pas"
                alt="Faux Pas Paw Image"
              />
              <img
                onClick={() => postFpfyVote(fpfys[currentFpfy].id, true)}
                src={`/images/FauxYea_JacquelineAlcantara.jpg`}
                title="Vote yea"
                alt="Faux Yeah Paw Image"
              />
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
            {currentFpfy !== 0 &&
              <button
                onClick={() => {
                  toggleFpfyImageLoading(true)
                  prev()
                }}
              >
                <div className={css.arrowLeft} />
              </button>
            }
            {currentFpfy !== fpfys.length-1 &&
              <button
                onClick={() => {
                  toggleFpfyImageLoading(true)
                  next(fpfys.length)
                }}
              >
                <div className={css.arrowRight} />
              </button>
            }
          </footer>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fpfys)
