import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { shallowUpdate, injectLogger } from '@common'
import { Prose } from '@components/Prose'
import { ImageSlider } from '@components/ImageSlider'
import actions from './actions'
import css from './Limiting.scss'

const mapStateToProps = (state, props) => ({
  meta:  (() => {
    const meta = state.issues[0].v2.limiting.meta
    const weekNumber = parseInt(props.params.article)
    let found
    meta.some(x => {
      if (x.fields.WeekNumber === weekNumber) {
        return (found = x.fields)
      }
    })

    return found
  })(),
  data: state.issues[0].v2.limiting.data
    .filter(entry => {
      return entry.fields.Issue === parseInt(props.params.issue) &&
        entry.fields.WeekNumber === parseInt(props.params.article)
    })
    .map(entry => entry.fields)
})

@shallowUpdate
@injectLogger
class Limiting extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    meta: PropTypes.object.isRequired
  }

  render() {
    const { params, data, meta } = this.props
    const prefix = `${params.issue}/${params.section}/${params.article}`

    this.debug(meta, data)

    return (
      <div className={css.Limiting}>
        <header>
          <h1 className={css.title}>
            Week {meta.WeekNumber}: {meta.Title}
          </h1>
        </header>
        <hr />
        <main>
          {data.map((x, i) => {
            return (
              <div key={i}>
                {i > 0 && <hr />}
                <h2 style={{ textAlign: 'center' }}>{x.Name}</h2>
                <ImageSlider
                  id={`${prefix}/${x.Name}`}
                  images={
                    x.Images && x.Images.length
                      ? x.Images.map((image, i) => ({
                          title: image.filename,
                          src: image.url
                        }))
                      : []
                  }
                />
                {x.HTML &&
                  <div className={css.prose}>
                    <Prose text={x.HTML} />
                  </div>
                }
              </div>
            )
          })}
        </main>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Limiting)
