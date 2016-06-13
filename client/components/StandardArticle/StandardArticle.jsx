import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { shallowUpdate, injectLogger } from '@common'
import { Prose } from '@components/Prose'
import { ImageSlider } from '@components/ImageSlider'

import css from './StandardArticle.scss'

const mapStateToProps = (state, props) => {
  const { params } = props

  return {
    id: `${params.issue}/${params.section}/${params.article}`,
    data: (() => {
      const data = state.issues[0].v2[props.params.section].data
      const slug = props.params.article
      let found
      data.some(x => {
        if (x.fields.Slug === slug) {
          return (found = x.fields)
        }
      })

      return found
    })()
  }
}

@injectLogger
@shallowUpdate
class StandardArticle extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
  }

  render() {
    const { id, data } = this.props

    const images = data.Images.map(image => ({
      title: image.filename,
      src: image.url
    }))

    return (
      <div className={css.StandardArticle}>
        <header>
          <h1 className={css.title}>{data.Name}</h1>
        </header>
        {images && !!images.length && <ImageSlider id={id} images={images} />}
        {data.HTML && <Prose text={data.HTML} />}
      </div>
    )
  }
}

export default connect(mapStateToProps)(StandardArticle)
