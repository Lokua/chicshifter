import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { shallowUpdate, injectLogger, dashToTitle, pluck } from '@common'
import { ImageSlider } from '@components/ImageSlider'
import css from './Street.scss'

const mapStateToProps = (state, props) => {
  const { params } = props
  const id = `${params.issue}/${params.section}/${params.article}`
  const articleTitle = dashToTitle(params.article)

  let index
  try {
    index = state.ui.imageSliders[id].index
  } catch (err) {
    index = 0
  }

  const { meta, data } = state.v2.street

  return {
    id,
    index,
    meta: meta.find(x => x.fields.Slug === props.params.article),
    data: data
      .filter(x => x.fields.Neighborhood === articleTitle)
      .map(pluck(`fields`))
  }
}

@injectLogger
@shallowUpdate
class Street extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    params: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired
  }

  render() {
    const { id, index, meta, data } = this.props

    const images = data.map(entry => ({
      title: entry.Image[0].filename,
      src: entry.Image[0].url,
      ...entry.Image[0]
    }))

    const current = data[index]

    return (
      <div className={css.Street}>
        <article>
          <header>
            <h1 className={css.title}>{meta.Neighborhood}</h1>
            <h5>{meta.Question}</h5>
          </header>
          <ImageSlider
            id={id}
            images={images}
          />
          {current &&
            <main className={css.main}>
              <h4>
                {current.Person},&nbsp;
                <small style={{ fontSize: `0.7em` }}>{current.Age}</small>
              </h4>
              <h5>"{current.Answer}"</h5>
            </main>
          }
        </article>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Street)
